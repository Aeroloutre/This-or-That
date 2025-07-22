import express from 'express'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const router = express.Router()

// Route GET /questions
router.get('/questions', async (req, res) => {
  const questions = await prisma.questions.findMany()
  res.json(questions)
})

// Route PUT /questions pour mettre à jour une question par index
router.put('/questions/:id/firstchoicecount', async (req, res) => {
  const questionIndex = parseInt(req.params.id)
  console.log("index de la question à put",questionIndex)
  const updatedQuestion = await prisma.questions.update({
      where: { id: questionIndex },
      data: {firstchoicecount: {increment: 1}}
  })

  res.json(updatedQuestion)
})

router.put('/questions/:id/secondchoicecount', async (req, res) => {
  const questionIndex = parseInt(req.params.id)
  console.log("index de la question à put",questionIndex)
  const updatedQuestion = await prisma.questions.update({
      where: { id: questionIndex },
      data: {secondchoicecount: {increment: 1}}
  })

  res.json(updatedQuestion)
})

router.post('/questions', (req, res) => {
  const question = req.body.question

  db.data.questions.push(question)

  db.write()

  res.json(question)
})

export { router }
