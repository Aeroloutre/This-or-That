import express from 'express'
import fs from 'fs'
import path from 'path'
import { db } from './db.js'

const router = express.Router()

// Route GET /questions
router.get('/questions', (req, res) => {
  res.json(db.data)
})

// Route PUT /questions pour mettre à jour une question par index
router.put('/questions/:index/value1', (req, res) => {
  const questionIndex = parseInt(req.params.index)

  console.log(db.data.questions, questionIndex)

  db.data.questions[questionIndex].value1++

  res.json(db.data.questions[questionIndex])

  db.write()
})

router.put('/questions/:index/value2', (req, res) => {
  const questionIndex = parseInt(req.params.index)

  db.data.questions[questionIndex].value2++

  res.json(db.data.questions[questionIndex])

  db.write()
})

export { router }
