import express from 'express'

import {
  addDeadPerson,
  getDeadPeople,
  getAllDeadPeople,
  getDeadPerson,
  updateDeadPerson,
  deleteDeadPerson,
} from '../controllers/deadPeople.js'
import { checkAdmin } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', getDeadPeople)
router.get('/all', getAllDeadPeople)
router.get('/:urlname', getDeadPerson)
router.post('/', checkAdmin, addDeadPerson)
router.put('/:urlname', checkAdmin, updateDeadPerson)
router.delete('/:urlname', checkAdmin, deleteDeadPerson)

export default router
