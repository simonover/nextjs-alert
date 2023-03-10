import { PrismaClient } from '@prisma/client'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { Storage } from '@google-cloud/storage'
import { format } from 'util'
import * as dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

export const getAllArticles = async (req, res, next) => {
  try {
    const articles = await prisma.article.findMany({
      orderBy: {
        published_at: 'desc',
      },
    })
    const total = await prisma.article.count()
    return res.status(200).json({ articles, total })
  } catch (error) {
    next(error)
  }
}

export const getArticles = async (req, res, next) => {
  try {
    const key = req.query?.search || ''
    const page = Number(req.query?.page) || 1,
      size = 10

    const articles = await prisma.article.findMany({
      where: {
        title: {
          contains: key,
          mode: 'insensitive',
        },
      },
      skip: size * (page - 1),
      take: size,
      include: {
        Comment: true,
      },
      orderBy: {
        published_at: 'desc',
      },
    })
    const total = await prisma.article.count({
      where: {
        title: {
          contains: key,
          mode: 'insensitive',
        },
      },
    })
    return res.status(200).json({ articles, total })
  } catch (error) {
    next(error)
  }
}

export const getArticleData = async (id) => {
  try {
    const article = await prisma.article.findFirst({
      where: { id: Number(id) },
    })
    if (typeof article.hashtags === 'string' && article.hashtags) {
      article.hashtags = article.hashtags.split(',')
    }
    return article
  } catch (error) {
    throw error
  }
}

export const getArticle = async (req, res, next) => {
  try {
    const { id } = req.params
    const article = await getArticleData(id)
    return res.status(200).json({ article })
  } catch (error) {
    next(error)
  }
}

export const addArticle = async (req, res, next) => {
  try {
    const form = new formidable.IncomingForm()
    let article, file

    form.parse(req, async (err, fields, files) => {
      const cloudStorage = new Storage({
        keyFilename: path.resolve(process.env.STORAGE_CONFIG_FILENAME),
        projectId: process.env.PROJECT_ID,
      })
      const bucketName = process.env.BUCKET_NAME
      const bucket = cloudStorage.bucket(bucketName)

      article = { ...fields }
      let tags = '',
        hashtags = JSON.parse(article.hashtags)
      if (Array.isArray(hashtags)) {
        const array = hashtags
        const length = array.length
        array.map((hash, index) => {
          tags += hash
          if (index !== length - 1) tags += ','
        })
        article.hashtags = tags
      }
      if (!article.published_at) article.published_at = new Date()
      else article.published_at = new Date(article.published_at)
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
          `${process.env.GOOGLE_CLOUD_STORE}${bucket.name}/${blob.name}`
        )
        try {
          const newArticle = await prisma.article.create({
            data: { ...article, photo: publicUrl },
          })
          return res.status(201).json({ article: newArticle })
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

export const editArticle = async (req, res, next) => {
  try {
    const form = new formidable.IncomingForm()
    const id = Number(req.params?.id)
    let data

    form.parse(req, async (err, fields, files) => {
      data = { ...fields }
      let tags = ''
      if (Array.isArray(data.hashtags)) {
        const array = data.hashtags
        const length = array.length
        array.map((hash, index) => {
          tags += hash
          if (index !== length - 1) tags += ','
        })
        data.hashtags = tags
      }
      if (data.published_at) data.published_at = new Date(published_at)
      const { photo } = files
      if (!photo) {
        try {
          const updatedArticle = await prisma.article.update({
            where: {
              id: id,
            },
            data: data,
          })
          return res.status(200).send({ article: updatedArticle })
        } catch (err) {
          return res.status(400).json(err)
        }
      }
      const cloudStorage = new Storage({
        keyFilename: path.resolve(process.env.STORAGE_CONFIG_FILENAME),
        projectId: process.env.PROJECT_ID,
      })
      const bucketName = process.env.BUCKET_NAME
      const bucket = cloudStorage.bucket(bucketName)

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
          `${process.env.GOOGLE_CLOUD_STORE}${bucket.name}/${blob.name}`
        )
        try {
          const updatedArticle = await prisma.article.update({
            where: {
              id: id,
            },
            data: { ...data, photo: publicUrl },
          })
          return res.status(201).json({ article: updatedArticle })
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

export const deleteArticle = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const article = await prisma.article.delete({
      where: { id: id },
    })
    return res.status(204).json()
  } catch (error) {
    next(error)
  }
}
