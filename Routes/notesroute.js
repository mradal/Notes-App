// notesroute.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to your JSON file (adjust as needed)
const dbPath = path.join(__dirname, '..', 'db', 'db.json');

// Read existing notes from db.json
function readNotes() {
  try {
    const notesData = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(notesData);
  } catch (error) {
    console.error('Error reading notes data:', error);
    return [];
  }
}

// Save notes to db.json
function saveNotes(notes) {
  fs.writeFileSync(dbPath, JSON.stringify(notes, null, 2));
}

let currentId = 1; // Initial ID value

function getNextId() {
  return currentId++;
}

// Retrieve existing notes
router.get('/notes', (req, res) => {
  const existingNotes = readNotes();
  res.json(existingNotes);
});

// Save a new note
router.post('/notes', (req, res) => {
  const newNote = req.body;
  try {
    const existingNotes = readNotes();
    newNote.id = getNextId().toString(); // Convert ID to string
    existingNotes.push(newNote);
    saveNotes(existingNotes);
    res.json(newNote);
  } catch (error) {
    console.error('Error saving new note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a note by ID
router.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  try {
    let existingNotes = readNotes();
    const initialLength = existingNotes.length;

    existingNotes = existingNotes.filter((note, index) => {
      return note.id !== noteId;
    });

    // If the length is unchanged, the note with the specified ID was not found
    if (existingNotes.length === initialLength) {
      return res.status(404).json({ error: 'Note not found' });
    }

    saveNotes(existingNotes);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
