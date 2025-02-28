// server.js
console.log('Server starting...');


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas using Mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
  
  // Start server after successful DB connection
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => console.error('MongoDB connection error:', err));

// Import and mount commands routes
const commandRoutes = require('./routes/commands');
app.use('/api/commands', commandRoutes);

// A sample test route
app.get('/', (req, res) => {
  res.send('Hello from your Coffee Shop Backend!');
});
