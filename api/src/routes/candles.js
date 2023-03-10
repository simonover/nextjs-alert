import express from 'express'

import {
  getAllDeadPeopleByCandles,
  setCandle,
} from '../controllers/deadPeople.js'

const router = express.Router()

router.get('/', getAllDeadPeopleByCandles)
router.put('/:urlname', setCandle)

export default router
