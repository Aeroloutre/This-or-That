import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken';
const SECRET = process.env.SECRET

export async function userAuth(req, res) {
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
            { id: user.id, email: user.email, name: user.name },
            SECRET,
            { expiresIn: '1h' }
        )

        res.json({ token })
    }

    catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

export async function createUser(req, res) {
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
            user: newUser
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Une erreur est survenue lors de la création du compte" })
    }
}

export async function getAllUsers(req, res) {
    try {
        const users = await prisma.users.find()
        res.json(users)
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
}

export async function verifyToken(req, res) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.sendStatus(401).message("Aucun token trouvé")

    try {
        const decoded = jwt.verify(token, SECRET)
        res.status(200).json({ message: 'Token valide', user: decoded })
    } catch (error) {
        res.status(403).json({ message: 'Token invalide' })
    }
}