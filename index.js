const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static frontend files from your "Project" folder
app.use(express.static(path.join(__dirname, 'Project')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hours', require('./routes/hourRoutes'));
app.use('/api/opportunities', require('./routes/opportunityRoutes'));

// Fallback to serve index.html for any root frontend request
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Project', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});