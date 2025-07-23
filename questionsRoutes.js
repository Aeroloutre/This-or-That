import express from 'express'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const router = express.Router()

// Route GET /questions
router.get('/questions', async (req, res) => {
  try {
  const questions = await prisma.questions.findMany()
  res.json(questions)}
  catch (error) {
    console.error(error.message)
    res.sendStatus(500).json({ error: error.message })
  }
})

// Route PUT /questions pour mettre à jour une question par index
router.put('/questions/:id/firstchoicecount', async (req, res) => {
  const questionIndex = parseInt(req.params.id)
  console.log("index de la question à put", questionIndex)
  try {
  const updatedQuestion = await prisma.questions.update({
    where: { id: questionIndex },
    data: { firstchoicecount: { increment: 1 } }
  })
  res.json(updatedQuestion)}
  catch (error) {
    console.error(error.message)
    res.sendStatus(500).json({ error: error.message })
  }
})

router.put('/questions/:id/secondchoicecount', async (req, res) => {
  const questionIndex = parseInt(req.params.id)
  console.log("index de la question à put", questionIndex)
  try {
  const updatedQuestion = await prisma.questions.update({
    where: { id: questionIndex },
    data: { secondchoicecount: { increment: 1 } }
  })
  res.json(updatedQuestion)}
  catch (error) {
    console.error(error.message)
    res.sendStatus(500).json({ error: error.message })
  }
})

router.post('/questions',async (req, res) => {
  const question = req.body.question
  try {
    const newQuestion = await prisma.questions.create({
      data: {
        firstchoice: question.firstchoice,
        firstchoicecount: question.firstchoicecount,
        secondchoice: question.secondchoice,
        secondchoicecount: question.secondchoicecount
      }
    })
    res.json(newQuestion)}
    catch (error) {
      console.error(error.message)
      res.sendStatus(500).json({ error: error.message })
    }
})

export { router }
