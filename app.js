import express from 'express'
import cors from 'cors'
import questionRoutes from './routes/questionsRoutes.js'
import userRoutes from './routes/userRoutes.js'
import dotenv from 'dotenv'
dotenv.config()
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/index.html', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/accountCreation.html', (req, res) => {
  res.sendFile(__dirname + '/views/accountCreation.html');
});

app.get('/playTheGame.html', (req, res) => {
  res.sendFile(__dirname + '/views/playTheGame.html');
});

app.get('/submitAQuestion.html', (req, res) => {
  res.sendFile(__dirname + '/views/submitAQuestion.html');
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
})

// Utilise les routes du backend
app.use('/', questionRoutes, userRoutes)
