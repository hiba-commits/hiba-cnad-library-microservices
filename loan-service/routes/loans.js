const express = require('express');
const axios = require('axios');
const router = express.Router();

// Service URLs from environment variables — not hardcoded
const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL || 'http://localhost:3001';
const MEMBER_SERVICE_URL = process.env.MEMBER_SERVICE_URL || 'http://localhost:3003';

// In-memory loan store
let loans = [];
let loanIdCounter = 1;

// Helper: Fetch book with timeout + basic retry
async function fetchBook(bookId, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(
        `${BOOK_SERVICE_URL}/books/${bookId}`,
        { timeout: 3000 }
      );
      return response.data.data;
    } catch (error) {
  console.warn(`Attempt ${attempt}/${retries} failed for book ${bookId}`);

  // If book does not exist, return null instead of throwing
  if (error.response && error.response.status === 404) {
    return null;
  }

  if (attempt === retries) throw error;

  await new Promise(r => setTimeout(r, 500 * attempt));
}
  }
}

// Helper: Fetch member with timeout + basic retry
async function fetchMember(memberId, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(
        `${MEMBER_SERVICE_URL}/members/${memberId}`,
        { timeout: 3000 }
      );
      return response.data.data;
    } catch (error) {
  console.warn(`Attempt ${attempt}/${retries} failed for member ${memberId}`);

  // If member does not exist, return null instead of throwing
  if (error.response && error.response.status === 404) {
    return null;
  }

  if (attempt === retries) throw error;

  await new Promise(r => setTimeout(r, 500 * attempt));
}
  }
}

// POST /loans — Create a new loan
router.post('/', async (req, res) => {
  const { bookId, memberId } = req.body;

  if (!bookId || !memberId) {
    return res.status(400).json({ error: "bookId and memberId are required" });
  }

  try {
    // --- Inter-service REST call to Book Service ---
    const book = await fetchBook(bookId);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (book.stock <= 0) {
      return res.status(409).json({
        error: "Book not available",
        available: book.stock
      });
    }

    // --- Inter-service REST call to Member Service ---
    const member = await fetchMember(memberId);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const loan = {
      id: loanIdCounter++,
      memberId: member.id,
      memberName: member.name,
      bookId: book.id,
      bookTitle: book.title,
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    };

    loans.push(loan);

    res.status(201).json({
      service: "loan-service",
      message: "Loan created successfully",
      data: loan
    });

  } catch (error) {
    console.error("Loan creation failed:", error.message);

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: "Dependent service unavailable — please retry",
        retryAfter: 5
      });
    }

    res.status(500).json({
      error: "Loan processing failed",
      detail: error.message
    });
  }
});

// GET /loans — List all loans
router.get('/', (req, res) => {
  res.json({ service: "loan-service", count: loans.length, data: loans });
});

// GET /loans/:id
router.get('/:id', (req, res) => {
  const loan = loans.find(o => o.id == req.params.id);

  if (!loan) {
    return res.status(404).json({ error: `Loan ${req.params.id} not found` });
  }

  res.json({ service: "loan-service", data: loan });
});

module.exports = router;