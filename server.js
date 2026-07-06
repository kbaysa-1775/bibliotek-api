const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Book = require('./models/Book');
const app = express();
const PORT = 5000;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/bibliotek')
  .then(() => console.log('Connected to Bibliotek MongoDB'))
  .catch((err) => console.error('Database connection error:', err));

app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server encountered an error retrieving the catalog." });
  }
});

app.post('/api/books', async (req, res) => {
  try {
    const newBook = await Book.create(req.body);

    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: "Invalid book data provided." });
  }
});

app.listen(PORT, () => {
  console.log(`Bibliotek API is live on port ${PORT}`);
});