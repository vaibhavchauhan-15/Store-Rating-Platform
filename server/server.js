const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { sequelize } = require('./config/database');

// Import models and set up associations
const User = require('./models/User');
const Store = require('./models/Store');
const Rating = require('./models/Rating');

// Define associations
User.hasMany(Rating, { foreignKey: 'user_id' });
Rating.belongsTo(User, { foreignKey: 'user_id' });

Store.hasMany(Rating, { foreignKey: 'store_id' });
Rating.belongsTo(Store, { foreignKey: 'store_id' });

// Store owner association
User.hasMany(Store, { foreignKey: 'owner_id', as: 'ownedStores' });
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

// Sync database with models
async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized with models');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
}

syncDatabase();

// Define Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/stores', require('./routes/stores.routes'));
app.use('/api/ratings', require('./routes/ratings.routes'));

// API status route for health checks
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  try {
    // Check if client/build exists
    if (require('fs').existsSync(path.join(__dirname, '../client/build'))) {
      // Set static folder
      app.use(express.static(path.join(__dirname, '../client/build')));

      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'));
      });
    } else {
      // If client/build doesn't exist, just serve API endpoints
      app.get('/', (req, res) => {
        res.json({ 
          message: 'Store Rating Platform API',
          endpoints: [
            '/api/auth', 
            '/api/users', 
            '/api/stores', 
            '/api/ratings'
          ]
        });
      });
    }
  } catch (error) {
    console.error('Error setting up static files:', error);
  }
} else {
  // Serve static files in development mode too
  app.use(express.static(path.join(__dirname, '../client/public')));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
