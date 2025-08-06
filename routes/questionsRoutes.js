import express from 'express'

import { authenticateToken } from '../Middlewares/authMiddleware.js'

import {
  getAllQuestions,
  getBannedQuestions,
  resetBannedQuestions,
  voteSecondChoice,
  voteFirstChoice,
  createQuestion
} from '../controllers/questionController.js';

const router = express.Router()

router.get('/questions', authenticateToken, getAllQuestions)
router.put('/questions/:id/:userId/firstChoiceCount', authenticateToken, voteFirstChoice)
router.put('/questions/:id/:userId/secondChoiceCount', authenticateToken, voteSecondChoice)
router.post('/questions', authenticateToken, createQuestion)

router.get('/bannedQuestions/:userId', authenticateToken, getBannedQuestions)
router.delete(`/resetQuestions/:userId`, authenticateToken, resetBannedQuestions)

export default router