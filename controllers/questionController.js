import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getAllQuestions(req, res) {
    try {
        const questions = await prisma.questions.findMany()
        res.json(questions)
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

export async function createQuestion(req, res) {
    const question = req.body.question
    try {
        const newQuestion = await prisma.questions.create({
            data: {
                firstChoice: question.firstChoice,
                firstChoiceCount: question.firstChoiceCount,
                secondChoice: question.secondChoice,
                secondChoiceCount: question.secondChoiceCount
            }
        })
        res.json(newQuestion)
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

export async function voteFirstChoice(req, res) {
  const questionId = parseInt(req.params.id)
  const userId = parseInt(req.params.userId)
  try {
    await prisma.banned_questions_users.create({
      data: { userid: userId, questionid: questionId }
    })

    const updatedQuestion = await prisma.questions.update({
      where: { id: questionId },
      data: { firstChoiceCount: { increment: 1 } }
    })

    res.json(updatedQuestion)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export async function voteSecondChoice(req, res) {
  const questionId = parseInt(req.params.id)
  const userId = parseInt(req.params.userId)
  try {
    await prisma.banned_questions_users.create({
      data: { userid: userId, questionid: questionId }
    })

    const updatedQuestion = await prisma.questions.update({
      where: { id: questionId },
      data: { secondChoiceCount: { increment: 1 } }
    })

    res.json(updatedQuestion)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export async function getBannedQuestions(req, res) {
  const userId = parseInt(req.params.userId)
  try {
    const bannedQuestions = await prisma.banned_questions_users.findMany({
      where: { userid: userId }
    })
    res.json(bannedQuestions)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export async function resetBannedQuestions(req, res) {
  const userId = parseInt(req.params.userId)
  try {
    const result = await prisma.banned_questions_users.deleteMany({
      where: { userid: userId }
    })
    res.json(result.count)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}