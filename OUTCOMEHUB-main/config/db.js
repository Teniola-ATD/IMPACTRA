const { Pool } = require('pg');
require('dotenv').config();

// mongoose.connect(process.env.MONGO_URI)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// export pool toquery our tables inside our controllers
module.exports = pool;

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Database Connected Successfully!");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;