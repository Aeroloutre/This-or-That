const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const FILE_PATH = path.join(__dirname, 'questions.json');

if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, JSON.stringify([]));
}

// Route GET /questions
router.get('/questions', (req, res) => {
  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur de lecture du fichier JSON' });
    }
    res.json(JSON.parse(data));
  });
});

// Route PUT /questions pour mettre à jour une question par index
router.put('/questions/:index', (req, res) => {
  const questionIndex = parseInt(req.params.index);
  const updatedFields = req.body; // { question: "nouvelle question", ... }

  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erreur de lecture du fichier JSON' });

    let questions = JSON.parse(data);

    //est-ce que l'index de la question existe ?
    if (questionIndex < 0 || questionIndex >= questions.length) {
      return res.status(400).json({ error: 'Index de question invalide' });
    }

    // Met à jour uniquement les champs spécifiés
    questions[questionIndex] = { ...questions[questionIndex], ...updatedFields };

    fs.writeFile(FILE_PATH, JSON.stringify(questions, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Erreur d\'écriture du fichier JSON' });

      res.json({ message: 'Question mise à jour avec succès', updated: questions[questionIndex] });
    });
  });
});

module.exports = router;