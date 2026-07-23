require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Book = require('./models/Book');
const Librarian = require('./models/Librarian');
const protect = require('./middleware/protect');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to Bibliotek MongoDB'))
  .catch((err) => console.error('Database connection error:', err));

// POST /api/librarians/register
app.post('/api/librarians/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const librarian = await Librarian.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json(librarian);
  } catch (error) {
    res.status(400).json({
      message: "Invalid librarian data or email already exists."
    });
  }
});

// POST /api/librarians/login
app.post('/api/librarians/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const librarian = await Librarian.findOne({ email });

    if (!librarian) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      librarian.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: librarian._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({
      message: "Server error during login"
    });
  }
});

// Public route: anyone can view the catalog
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      message: "Server encountered an error retrieving the catalog."
    });
  }
});

// Protected route: only logged-in librarians can add books
app.post('/api/books', protect, async (req, res) => {
  try {
    const newBook = await Book.create(req.body);

    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({
      message: "Invalid book data provided."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Bibliotek API is live on port ${PORT}`);
});