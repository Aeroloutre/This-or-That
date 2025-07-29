import dotenv from 'dotenv'
dotenv.config();

import express from 'express'

import { PrismaClient } from '@prisma/client'

import jwt from 'jsonwebtoken'

import { authenticateToken } from './authMiddleware.js'

const prisma = new PrismaClient()

const router = express.Router()

const SECRET = process.env.SECRET

// Route GET /questions
router.get('/questions', authenticateToken, async (req, res) => {
  try {
    const questions = await prisma.questions.findMany()
    res.json(questions)
  }
  catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
})

// Route GET /users
/*router.get('/users', async (req, res) => {
  try {
    const users = await prisma.users.findMany()
    res.json(users)
  }
  catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
})*/

// Route PUT /questions pour mettre à jour une question par index
router.put('/questions/:id/firstchoicecount', authenticateToken, async (req, res) => {
  const questionIndex = parseInt(req.params.id)
  console.log("index de la question à put", questionIndex)
  try {
    const updatedQuestion = await prisma.questions.update({
      where: { id: questionIndex },
      data: { firstchoicecount: { increment: 1 } }
    })
    res.json(updatedQuestion)
  }
  catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
})

router.put('/questions/:id/secondchoicecount', authenticateToken, async (req, res) => {
  const questionIndex = parseInt(req.params.id)
  console.log("index de la question à put", questionIndex)
  try {
    const updatedQuestion = await prisma.questions.update({
      where: { id: questionIndex },
      data: { secondchoicecount: { increment: 1 } }
    })
    res.json(updatedQuestion)
  }
  catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
})

router.post('/questions', authenticateToken, async (req, res) => {
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
    res.json(newQuestion)
  }
  catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
})

router.post('/usersAuth', async (req, res) => {
  const inputUser = req.body.inputUser

  try {
    //On cherche l'email précisé dans la bdd
    const user = await prisma.users.findUnique({ where: { email: inputUser.email } })

    //si on ne le trouve pas, on répond que le mail est incorrect
    if (!user) {
      console.log("Email incorrect");
      return res.status(401).json({ message: "Email incorrect" })
    }

    //sinon, on vérifie le mot de passe aussi :
    if (user.password != inputUser.password) {
      console.log("Mot de passe incorrect");
      return res.status(401).json({ message: "Mot de passe incorrect" })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: '1h' }
    )

    res.json({ token })
  }

  catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
})

router.post('/users', async (req, res) => {
  const newInputUser = req.body.newInputUser
  try {
    const newUser = await prisma.users.create({
      data: {
        name: newInputUser.name,
        email: newInputUser.email,
        password: newInputUser.password
      }
    })
    return res.status(201).json({
      message: "Votre compte a bien été crée vos informations sont : ",
      user: newUser})
  }
  catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Une erreur est survenue lors de la création du compte" })
  }

  
})

export { router }
