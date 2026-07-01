const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(express.json());
const inventory = [
  { id: 1, title: "Toy Story", author: "Disney Pixar", isAvailable: true },
  { id: 2, title: "Finding Nemo", author: "Disney Pixar", isAvailable: true },
  { id: 3, title: "Cars", author: "Disney Pixar", isAvailable: false }
];

app.get('/api/books', (req, res) => {
  res.status(200).json(inventory);
});

app.post('/api/books', (req, res) => {
  const newBook = req.body;
  newBook.id = inventory.length + 1;
  inventory.push(newBook);

  res.status(201).json(newBook);
});

app.listen(PORT, () => {
  console.log(`Bibliotek API is live on port ${PORT}`);
});