import { PrismaClient } from '@prisma/client'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { Storage } from '@google-cloud/storage'
import { format } from 'util'

import config from '../config/index.js'

const prisma = new PrismaClient()

export const getAllDeadPeople = async (req, res, next) => {
  try {
    const key = req.query?.search || ''
    const page = Number(req.query?.page) || 1,
      size = Number(req.query?.size) || 10

    const people = await prisma.deadPeople.findMany({
      where: {
        fullname: {
          contains: key,
          mode: 'insensitive',
        },
      },
      skip: size * (page - 1),
      take: size,
      orderBy: {
        deadDay: 'desc',
      },
    })
    const total = await prisma.deadPeople.count({
      where: {
        fullname: {
          contains: key,
          mode: 'insensitive',
        },
      },
    })

    return res.status(200).send({ people, total })
  } catch (error) {
    next(error)
  }
}

export const getAllDeadPeopleByCandles = async (req, res, next) => {
  try {
    const key = req.query?.search || ''
    const page = Number(req.query?.page) || 1,
      size = Number(req.query?.size) || 10

    const people = await prisma.deadPeople.findMany({
      where: {
        fullname: {
          contains: key,
          mode: 'insensitive',
        },
      },
      skip: size * (page - 1),
      take: size,
      orderBy: {
        candles: 'desc',
      },
    })
    const total = await prisma.deadPeople.count({
      where: {
        fullname: {
          contains: key,
          mode: 'insensitive',
        },
      },
    })
    return res.status(200).json({ people, total })
  } catch (error) {
    next(error)
  }
}

export const getDeadPersonData = async (req, res) => {
  try {
    const { urlname } = req.params
    const person = await prisma.deadPeople.findFirst({
      where: { urlname: urlname },
    })
    return person
  } catch (error) {
    throw error
  }
}

export const getDeadPerson = async (req, res) => {
  try {
    const { urlname } = req.params
    const person = await prisma.deadPeople.findFirst({
      where: { urlname: urlname },
    })
    return res.status(200).json(person)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const addDeadPerson = async (req, res, next) => {
  try {
    const form = new formidable.IncomingForm()
    let person, file

    form.parse(req, async (err, fields, files) => {
      const cloudStorage = new Storage({
        keyFilename: path.resolve(config.STORAGE_CONFIG_FILENAME),
        projectId: config.PROJECT_ID,
      })
      const bucketName = config.BUCKET_NAME
      const bucket = cloudStorage.bucket(bucketName)

      person = { ...fields }
      person.urlname = fields.fullname.split(' ').join('').toLowerCase()
      if (person.age) person.age = Number(person.age)
      if (person.birthday) person.birthday = new Date(person.birthday)
      if (person.deadDay) person.deadDay = new Date(person.deadDay)

      const { photo } = files
      if (!photo) {
        return res.status(400).send('No file uploaded')
      }
      var oldPath = photo.filepath
      file = '/uploads/' + photo.originalFilename
      var rawData = fs.readFileSync(oldPath)

      const blob = bucket.file(photo.originalFilename)
      const blobStream = blob.createWriteStream()
      blobStream.on('error', (err) => {
        next(err)
      })
      blobStream.on('finish', async () => {
        const publicUrl = format(
          `${config.GOOGLE_CLOUD_STORE}${bucket.name}/${blob.name}`
        )
        try {
          const newPerson = await prisma.deadPeople.create({
            data: { ...person, photo: publicUrl },
          })
          return res.status(201).json({ person: newPerson })
        } catch (error) {
          return res.status(500).json({ error })
        }
      })
      blobStream.end(rawData)
    })
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const updateDeadPerson = async (req, res, next) => {
  try {
    const form = new formidable.IncomingForm()
    const urlname = req.params?.urlname
    let file
    form.parse(req, async (err, fields, files) => {
      const cloudStorage = new Storage({
        keyFilename: path.resolve(config.STORAGE_CONFIG_FILENAME),
        projectId: config.PROJECT_ID,
      })
      const bucketName = config.BUCKET_NAME
      const bucket = cloudStorage.bucket(bucketName)

      const data = { ...fields }
      if (data.fullname)
        data.urlname = fields.fullname.split(' ').join('').toLowerCase()
      if (data.age) data.age = Number(data.age)
      if (data.birthday) data.birthday = new Date(data.birthday)
      if (data.deadDay) data.deadDay = new Date(data.deadDay)

      const { photo } = files
      if (!photo) {
        try {
          const updatedPerson = await prisma.deadPeople.update({
            where: {
              urlname: urlname,
            },
            data: data,
          })
          return res.status(200).json({ person: updatedPerson })
        } catch (error) {
          return res.status(400).json(error)
        }
      }

      var oldPath = photo.filepath
      file = '/uploads/' + photo.originalFilename
      var rawData = fs.readFileSync(oldPath)

      const blob = bucket.file(photo.originalFilename)
      const blobStream = blob.createWriteStream()
      blobStream.on('error', (err) => {
        next(err)
      })
      blobStream.on('finish', async () => {
        const publicUrl = format(
          `${config.GOOGLE_CLOUD_STORE}${bucket.name}/${blob.name}`
        )
        try {
          const updatedPerson = await prisma.deadPeople.update({
            where: {
              urlname: urlname,
            },
            data: { ...data, photo: publicUrl },
          })
          return res.status(201).json({ person: updatedPerson })
        } catch (error) {
          next(error)
        }
      })
      blobStream.end(rawData)
    })
  } catch (error) {
    next(error)
  }
}

export const deleteDeadPerson = async (req, res, next) => {
  try {
    const { urlname } = req.params
    const person = await prisma.deadPeople.delete({
      where: { urlname: urlname },
    })
    return res.status(204).json()
  } catch (error) {
    next(error)
  }
}

export const setCandle = async (req, res, next) => {
  try {
    const urlname = req.params?.urlname
    const candle = Number(req.body?.candle)
    const person = await prisma.deadPeople.findFirst({
      where: { urlname: urlname },
    })
    const updatedPerson = await prisma.deadPeople.update({
      where: {
        urlname: urlname,
      },
      data: {
        candles: person.candles + candle,
      },
    })
    return res.status(200).json({ candles: updatedPerson.candles })
  } catch (error) {
    next(error)
  }
}
