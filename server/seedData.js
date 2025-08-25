const { sequelize } = require('./config/database');
const { User, Store, Rating } = require('./models');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Sync models with database (force: true to drop tables and recreate)
    await sequelize.sync({ force: true });
    console.log('Database tables created.');

    // Create sample users
    const users = await User.bulkCreate([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('password123', 10),
        address: '123 Admin Street, Admin City, AC 12345',
        role: 'admin'
      },
      {
        name: 'Store Owner',
        email: 'owner@example.com',
        password: await bcrypt.hash('password123', 10),
        address: '456 Owner Avenue, Business City, BC 67890',
        role: 'store_owner'
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password: await bcrypt.hash('password123', 10),
        address: '789 User Boulevard, User Town, UT 54321',
        role: 'user'
      },
      {
        name: 'Another User',
        email: 'user2@example.com',
        password: await bcrypt.hash('password123', 10),
        address: '101 Customer Road, User City, UC 98765',
        role: 'user'
      }
    ]);
    
    console.log('Sample users created.');

    // Create sample stores
    const stores = await Store.bulkCreate([
      {
        name: 'Sunshine Cafe',
        email: 'contact@sunshinecafe.com',
        address: '123 Main St, Anytown, USA',
        description: 'A cozy cafe with delicious coffee and pastries.',
        contact: '555-123-4567',
        hours: 'Mon-Fri: 7am-8pm, Sat-Sun: 8am-6pm',
        owner_id: 2 // Store Owner
      },
      {
        name: 'Tech Gadgets Shop',
        email: 'info@techgadgets.com',
        address: '456 Tech Blvd, Silicon Valley, CA',
        description: 'The latest technology gadgets and accessories.',
        contact: '555-987-6543',
        hours: 'Mon-Sat: 10am-9pm, Sun: 11am-6pm',
        owner_id: 2 // Store Owner
      },
      {
        name: 'Fresh Groceries',
        email: 'service@freshgroceries.com',
        address: '789 Farm Road, Countryside, USA',
        description: 'Fresh local produce and organic goods.',
        contact: '555-456-7890',
        hours: 'Daily: 8am-10pm',
        owner_id: null // No owner yet
      },
      {
        name: 'Book Haven',
        email: 'books@bookhaven.com',
        address: '101 Library Lane, Booktown, USA',
        description: 'A quiet bookstore with a wide selection of genres.',
        contact: '555-234-5678',
        hours: 'Mon-Sat: 9am-7pm, Sun: 12pm-5pm',
        owner_id: null // No owner yet
      },
      {
        name: 'Fitness First',
        email: 'info@fitnessfirst.com',
        address: '202 Gym Avenue, Healthville, USA',
        description: 'State-of-the-art fitness equipment and personal training.',
        contact: '555-345-6789',
        hours: 'Mon-Fri: 5am-11pm, Sat-Sun: 7am-9pm',
        owner_id: null // No owner yet
      }
    ]);
    
    console.log('Sample stores created.');

    // Create sample ratings
    const ratings = await Rating.bulkCreate([
      {
        user_id: 3, // Regular User
        store_id: 1, // Sunshine Cafe
        rating: 5
      },
      {
        user_id: 4, // Another User
        store_id: 1, // Sunshine Cafe
        rating: 4
      },
      {
        user_id: 3, // Regular User
        store_id: 2, // Tech Gadgets Shop
        rating: 3
      },
      {
        user_id: 4, // Another User
        store_id: 2, // Tech Gadgets Shop
        rating: 5
      },
      {
        user_id: 3, // Regular User
        store_id: 3, // Fresh Groceries
        rating: 4
      },
      {
        user_id: 4, // Another User
        store_id: 4, // Book Haven
        rating: 5
      }
    ]);
    
    console.log('Sample ratings created.');
    console.log('Database seeded successfully!');

    console.log('\n--- Sample User Credentials ---');
    console.log('Admin: admin@example.com / password123');
    console.log('Store Owner: owner@example.com / password123');
    console.log('User: user@example.com / password123');
    console.log('User 2: user2@example.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit();
  }
}

seedDatabase();
