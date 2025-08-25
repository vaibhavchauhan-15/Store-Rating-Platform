const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validateRequest = require('../middleware/validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name must be between 20 and 60 characters').isLength({ min: 20, max: 60 }),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 8-16 characters with at least one uppercase letter and one special character')
      .isLength({ min: 8, max: 16 })
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, 'g'),
    check('address', 'Address cannot exceed 400 characters').isLength({ max: 400 }),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { name, email, password, address } = req.body;

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
        role: 'user'
      });

      if (user) {
        res.status(201).json({
          success: true,
          token: generateToken(user.id),
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Invalid user data'
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      
      console.log('User logged in:', user.email, 'Role:', user.role);

      res.json({
        success: true,
        token: generateToken(user.id),
        user: {
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

module.exports = router;
