import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.SECRET;

export function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // On découpe le token qui est de la forme "Bearer aknsdfgosijdfgp..." pour garder que la chaine du token

    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // on stocke l'utilisateur dans req.user
        next();
    } catch (err) {
        console.log("erreur: ", token, SECRET);
        return res.status(403).json({ message: 'Token invalide' });
    }
}