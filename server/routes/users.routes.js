const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validateRequest = require('../middleware/validator');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    let whereClause = {};

    // Apply filters if provided
    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
    if (email) whereClause.email = { [Op.iLike]: `%${email}%` };
    if (address) whereClause.address = { [Op.iLike]: `%${address}%` };
    if (role) whereClause.role = role;

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [
        ['name', 'ASC']
      ]
    });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If user is a store owner, include their store information
    if (user.role === 'store_owner') {
      const store = await Store.findOne({
        where: { owner_id: user.id },
        include: [
          {
            model: require('../models/Rating'),
            attributes: ['rating']
          }
        ]
      });

      // Calculate average rating if store exists
      let averageRating = null;
      if (store && store.Ratings && store.Ratings.length > 0) {
        averageRating = store.Ratings.reduce((acc, curr) => acc + curr.rating, 0) / store.Ratings.length;
      }

      return res.json({
        success: true,
        data: {
          ...user.toJSON(),
          store: store ? {
            ...store.toJSON(),
            averageRating
          } : null
        }
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  [
    check('name', 'Name must be between 2 and 60 characters').isLength({ min: 2, max: 60 }),
    check('address', 'Address cannot exceed 400 characters').optional().isLength({ max: 400 }),
  ],
  validateRequest,
  protect,
  async (req, res) => {
    try {
      const { name, address } = req.body;

      // Find user
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update user fields
      if (name) user.name = name;
      if (address) user.address = address;
      
      await user.save();

      // Return updated user without password
      const updatedUser = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });

      res.json({
        success: true,
        data: updatedUser
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @route   PUT /api/users/password
// @desc    Update user password
// @access  Private
router.put(
  '/password',
  [
    check('currentPassword', 'Current password is required').exists(),
    check('newPassword', 'New password must be 8-16 characters with at least one uppercase letter and one special character')
      .isLength({ min: 8, max: 16 })
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, 'g')
  ],
  validateRequest,
  protect,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      // Get user
      const user = await User.findByPk(req.user.id);

      // Check if current password matches
      const isMatch = await user.matchPassword(currentPassword);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @route   POST /api/users
// @desc    Create a new user (admin only)
// @access  Private/Admin
router.post(
  '/',
  [
    check('name', 'Name must be between 2 and 60 characters').isLength({ min: 2, max: 60 }),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('address', 'Address cannot exceed 400 characters').optional().isLength({ max: 400 }),
    check('role', 'Role is required').isIn(['admin', 'user', 'store_owner'])
  ],
  validateRequest,
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const { name, email, password, address, role } = req.body;

      // Check if user already exists
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        address,
        role
      });

      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          address: user.address,
          role: user.role
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @route   GET /api/users/owner-dashboard
// @desc    Get store owner dashboard data
// @access  Private/StoreOwner
router.get('/owner-dashboard', protect, authorize('store_owner'), async (req, res) => {
  try {
    console.log('Store owner dashboard accessed by:', req.user.email);
    
    // Get owner's stores
    const stores = await Store.findAll({
      where: { owner_id: req.user.id },
      include: [{
        model: Rating,
        attributes: []
      }],
      attributes: [
        'id', 
        'name', 
        'address', 
        'description',
        [sequelize.fn('COUNT', sequelize.col('Ratings.id')), 'ratingCount'],
        [sequelize.fn('AVG', sequelize.col('Ratings.rating')), 'averageRating']
      ],
      group: ['Store.id'],
      raw: true
    });
    
    console.log('Owner stores found:', stores.length);
    
    // Get total ratings for all owner's stores
    const storeIds = stores.map(store => store.id);
    const totalRatings = storeIds.length > 0 ? 
      await Rating.count({
        where: {
          store_id: {
            [Op.in]: storeIds
          }
        }
      }) : 0;
    
    // Calculate overall average rating
    const averageRating = stores.length > 0 
      ? parseFloat((stores.reduce((acc, store) => acc + parseFloat(store.averageRating || 0), 0) / stores.length).toFixed(2))
      : 0;
    
    res.json({
      success: true,
      data: {
        storeCount: stores.length,
        totalRatings,
        averageRating,
        stores
      }
    });
  } catch (error) {
    console.error('Error in owner-dashboard route:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If user is a store owner, include their store information
    if (user.role === 'store_owner') {
      const store = await Store.findOne({
        where: { owner_id: user.id },
        include: [
          {
            model: require('../models/Rating'),
            attributes: ['rating']
          }
        ]
      });

      // Calculate average rating if store exists
      let averageRating = null;
      if (store && store.Ratings && store.Ratings.length > 0) {
        averageRating = store.Ratings.reduce((acc, curr) => acc + curr.rating, 0) / store.Ratings.length;
      }

      return res.json({
        success: true,
        data: {
          ...user.toJSON(),
          store: store ? {
            ...store.toJSON(),
            averageRating
          } : null
        }
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    // Get the current user
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get total stores
    const totalStores = await Store.count();
    
    // Get total ratings by this user
    const totalRatings = await Rating.count({
      where: { user_id: req.user.id }
    });
    
    // Get average rating across all stores
    const avgRatingResult = await Rating.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ],
      raw: true
    });
    
    const averageRating = parseFloat(avgRatingResult.averageRating || 0);
    
    res.json({
      success: true,
      data: {
        totalStores,
        totalRatings,
        averageRating
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private/Admin
router.get('/admin/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.count();
    
    // Get total stores
    const totalStores = await Store.count();
    
    // Get total ratings
    const totalRatings = await Rating.count();
    
    // Get average rating
    const avgRatingResult = await Rating.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ],
      raw: true
    });
    
    const averageRating = parseFloat(avgRatingResult.averageRating || 0);
    
    // Get users by role
    const usersByRole = {
      admin: await User.count({ where: { role: 'admin' } }),
      user: await User.count({ where: { role: 'user' } }),
      store_owner: await User.count({ where: { role: 'store_owner' } })
    };
    
    res.json({
      success: true,
      data: {
        totalUsers,
        totalStores,
        totalRatings,
        averageRating,
        usersByRole
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
