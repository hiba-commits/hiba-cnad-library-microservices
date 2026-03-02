const express = require('express');
const logger = require('./middleware/logger');
const loanRoutes = require('./routes/loans');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(logger);

// Mount loan routes
app.use('/loans', loanRoutes);

app.get('/health', (req, res) => {
  res.json({ status: "UP", service: "loan-service" });
});

app.listen(PORT, () => {
  console.log(`Loan Service running on port ${PORT}`);
});