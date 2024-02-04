// server.js

const express = require('express');
const path = require('path');
const notesRoutes = require('./Routes/notesroute');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', notesRoutes);

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
