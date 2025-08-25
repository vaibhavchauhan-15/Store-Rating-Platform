const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use environment variables from .env file with fallbacks
const sequelize = new Sequelize(
  process.env.DB_NAME || 'store_ratings_db', 
  process.env.DB_USER || 'postgres', 
  process.env.DB_PASSWORD || 'postgres', 
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, testConnection };
