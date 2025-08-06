import express from 'express'

import { authenticateToken } from '../Middlewares/authMiddleware.js'

import { 
    userAuth,
    createUser,
    getAllUsers,
    verifyToken
} from '../controllers/userController.js'

const router = express.Router()

router.get('/getAllUsers', authenticateToken, getAllUsers)
router.post('/createUser', createUser)

router.post('/userAuth', userAuth)
router.get('/verifyToken', verifyToken)

export default router