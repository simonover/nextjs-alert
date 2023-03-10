import express from 'express'

import {
  addArticle,
  deleteArticle,
  editArticle,
  getAllArticles,
  getArticles,
  getArticle,
} from '../controllers/articles.js'
import { checkAdmin } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', getArticles)
router.get('/all', getAllArticles)
router.get('/:id', getArticle)
router.post('/', checkAdmin, addArticle)
router.put('/:id', checkAdmin, editArticle)
router.delete('/:id', checkAdmin, deleteArticle)

export default router
