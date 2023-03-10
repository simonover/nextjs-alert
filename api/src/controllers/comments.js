import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getCommentsByDead = async (req, res, next) => {
  try {
    const { id } = req.params
    const comments = await prisma.comment.findMany({
      where: {
        deadPeopleId: Number(id),
      },
    })
    return res.status(200).json({ comments })
  } catch (error) {
    next(error)
  }
}

export const getCommentsByArticle = async (req, res, next) => {
  try {
    const id = Number(req.params?.id)
    const comments = await prisma.comment.findMany({
      where: {
        articleId: id,
      },
    })
    return res.status(200).json({ comments })
  } catch (error) {
    next(error)
  }
}

export const addComment = async (req, res, next) => {
  try {
    const { content, username, articleId, deadPeopleId } = req.body
    const newComment = await prisma.comment.create({
      data: {
        content: content,
        username: username,
        articleId: articleId && Number(articleId),
        deadPeopleId: deadPeopleId && Number(deadPeopleId),
      },
    })
    return res.status(200).json({ comment: newComment })
  } catch (error) {
    next(error)
  }
}

export const deleteComment = async (req, res, next) => {
  try {
    const id = Number(req.params?.id)
    const deleted = await prisma.comment.delete({
      where: {
        id: id,
      },
    })
    return res.status(204).json()
  } catch (error) {
    next(error)
  }
}
