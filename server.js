import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { router } from './questionsRoutes.js';
import { JSONFilePreset } from 'lowdb/node';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 👇 Ceci sert le fichier index.html quand tu vas sur "/"
app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

////////////////////////////////////

// Utilise les routes du backend
app.use('/', router);
