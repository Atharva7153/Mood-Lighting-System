require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Mood = require('./models/mood');

const app = express();
app.use(cors());
app.use(express.json());

// Serve admin static files
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/moodlamp';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/health', (req, res) => res.json({ ok: true }));

// Get all moods
app.get('/moods', async (req, res) => {
  try {
    const moods = await Mood.find().sort({ name: 1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch moods' });
  }
});

// Create a mood
app.post('/moods', async (req, res) => {
  try {
    const { name, singleColor, multiColors } = req.body;
    if (!name || !singleColor) return res.status(400).json({ error: 'Missing name or singleColor' });
    const mood = new Mood({ name, singleColor, multiColors });
    await mood.save();
    res.status(201).json(mood);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create mood' });
  }
});

// Update a mood
app.put('/moods/:id', async (req, res) => {
  try {
    const updated = await Mood.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Mood not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update mood' });
  }
});

// Delete a mood
app.delete('/moods/:id', async (req, res) => {
  try {
    const deleted = await Mood.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Mood not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete mood' });
  }
});

app.listen(PORT, () => {
  console.log(`Mood backend listening on port ${PORT}`);
});
