const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 👇 Ceci sert le fichier index.html quand tu vas sur "/"
app.use(express.static('public'));

const FILE_PATH = './votes.json';

if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, JSON.stringify([]));
}

app.post('/vote', (req, res) => {
  const vote = req.body;
  const votes = JSON.parse(fs.readFileSync(FILE_PATH));
  votes.push(vote);
  fs.writeFileSync(FILE_PATH, JSON.stringify(votes, null, 2));
  res.json({ status: 'Vote enregistré' });
});

app.get('/results', (req, res) => {
  const votes = JSON.parse(fs.readFileSync(FILE_PATH));
  res.json(votes);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
