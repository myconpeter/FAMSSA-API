const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  category: String,
  available: Boolean
});

module.exports = mongoose.model('Book', bookSchema);
