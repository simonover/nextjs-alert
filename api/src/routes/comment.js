import express from 'express'

import {
  getCommentsByArticle,
  getCommentsByDead,
  addComment,
  deleteComment,
} from '../controllers/comments.js'
import { checkAdmin } from '../middlewares/auth.js'

const router = express.Router()

router.get('/dead/:id', getCommentsByDead)
router.get('/article/:id', getCommentsByArticle)
router.post('/', addComment)
router.delete('/:id', checkAdmin, deleteComment)

export default router
