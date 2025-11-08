const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const feedbackFile = path.join(__dirname, 'feedback.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Get feedbacks
app.get('/feedback', (req, res) => {
  fs.readFile(feedbackFile, (err, data) => {
    if (err) return res.status(500).send('Error reading feedback file.');
    const feedbacks = JSON.parse(data || '[]');
    res.json(feedbacks);
  });
});

// Post feedback
app.post('/feedback', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) return res.status(400).send('All fields required');

  fs.readFile(feedbackFile, (err, data) => {
    const feedbacks = err ? [] : JSON.parse(data || '[]');
    feedbacks.push({ name, message });
    fs.writeFile(feedbackFile, JSON.stringify(feedbacks, null, 2), (err) => {
      if (err) return res.status(500).send('Error saving feedback');
      res.sendStatus(200);
    });
  });
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
