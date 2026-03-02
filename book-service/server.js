const express = require('express');
const logger = require('./middleware/logger');
const bookRoutes = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(logger);

// Mount book routes
app.use('/books', bookRoutes);

app.get('/health', (req, res) => {
  res.json({ status: "UP", service: "book-service" });
});

app.listen(PORT, () => {
  console.log(`Book Service running on port ${PORT}`);
});