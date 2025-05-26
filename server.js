const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const questionsRoutes = require('./questionsRoutes'); // 🔁 import des routes

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
app.use('/', questionsRoutes);
