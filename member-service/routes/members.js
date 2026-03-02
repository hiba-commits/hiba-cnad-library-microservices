const express = require('express');
const router = express.Router();

const members = [
  { id: 1, name: "Hiba", email: "Hiba@email.com" },
  { id: 2, name: "Leila", email: "Leila@email.com" },
  { id: 3, name: "Taha", email: "Taha@email.com" }
];

// MODIFIED 
// GET all members

router.get('/', (req, res) => {
  res.json({ service: "member-service", data: members });
});
// GET single member
router.get('/:id', (req, res) => {
  const member = members.find(m => m.id == req.params.id);

  if (!member) {
    return res.status(404).json({ error: `Member ${req.params.id} not found` });
  }

  res.json({ service: "member-service", data: member });
});
// Health check — required by any real service
router.get('/health', (req, res) => {
 res.json({ status: "UP", service: "member-service", timestamp: new Date() });
});
module.exports = router;