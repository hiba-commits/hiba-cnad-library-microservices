const express = require('express');
const router = express.Router();

const books = [
  { id: 1, title: "Clean Code", author: "Robert Martin", stock: 5 },
  { id: 2, title: "The Pragmatic Programmer", author: "Andrew Hunt", stock: 3 },
  { id: 3, title: "Design Patterns", author: "GoF", stock: 2 }
];

// MODIFIED 
// GET all Books

router.get('/', (req, res) => {
 res.json({ service: "book-service", data: books });
});
// GET single product
router.get('/:id', (req, res) => {
 const book = books.find(b => b.id == req.params.id);
 if (!book) {
 return res.status(404).json({ error: `Book ${req.params.id} not found` });
 }
 res.json({ service: "book-service", data: book });
});
// Health check — required by any real service
router.get('/health', (req, res) => {
 res.json({ status: "UP", service: "book-service", timestamp: new Date() });
});
module.exports = router;