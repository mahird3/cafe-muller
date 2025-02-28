// models/Command.js
const mongoose = require('mongoose');

const CommandSchema = new mongoose.Schema({
  // This field stores whether the command came from a table or a customer.
  type: { type: String, enum: ['table', 'customer'], required: true },
  // Identifier for the table (e.g., "Table 1") or customer name/ID.
  identifier: { type: String, required: true },
  // Items in the order
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  // Timestamp for when this command was created
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Command', CommandSchema);
