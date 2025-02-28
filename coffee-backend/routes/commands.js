// routes/commands.js
const express = require('express');
const router = express.Router();
const Command = require('../models/Command');

// GET all commands
router.get('/', async (req, res) => {
  try {
    const commands = await Command.find().sort({ createdAt: -1 });
    res.json(commands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new command
router.post('/', async (req, res) => {
  const { type, identifier, items } = req.body;
  const command = new Command({
    type,
    identifier,
    items,
  });
  try {
    const newCommand = await command.save();
    res.status(201).json(newCommand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a command by ID
router.delete('/:id', async (req, res) => {
  try {
    const command = await Command.findById(req.params.id);
    if (!command) return res.status(404).json({ message: 'Command not found' });
    await command.remove();
    res.json({ message: 'Command deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
