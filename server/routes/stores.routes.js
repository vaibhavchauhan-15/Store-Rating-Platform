const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validateRequest = require('../middleware/validator');
const { protect, authorize } = require('../middleware/auth');
const Store = require('../models/Store');
const User = require('../models/User');
const Rating = require('../models/Rating');
const { Op, Sequelize } = require('sequelize');

// @route   GET /api/stores
// @desc    Get all stores
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { name, address } = req.query;
    let whereClause = {};

    // Apply filters if provided
    if (name) whereClause.name = { [Op.like]: `%${name}%` };
    if (address) whereClause.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where: whereClause,
      include: [
        {
          model: Rating,
          attributes: ['rating']
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [
        ['name', 'ASC']
      ]
    });

    // Calculate average rating for each store
    const storesWithRatings = stores.map(store => {
      const ratings = store.Ratings || [];
      const averageRating = ratings.length > 0
        ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
        : null;

      return {
        ...store.toJSON(),
        averageRating,
        ratingCount: ratings.length
      };
    });

    res.json({
      success: true,
      count: stores.length,
      data: storesWithRatings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/stores/:id
// @desc    Get store by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [
        {
          model: Rating,
          attributes: ['id', 'rating', 'user_id', 'createdAt', 'updatedAt'],
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'email']
            }
          ]
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Calculate average rating
    const ratings = store.Ratings || [];
    const averageRating = ratings.length > 0
      ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
      : null;

    // If user is authenticated, add their rating for this store
    let userRating = null;
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Find user's rating for this store
        const ratingEntry = await Rating.findOne({
          where: {
            user_id: userId,
            store_id: store.id
          }
        });

        if (ratingEntry) {
          userRating = ratingEntry.rating;
        }
      } catch (error) {
        // Token invalid, just ignore
      }
    }

    res.json({
      success: true,
      data: {
        ...store.toJSON(),
        averageRating,
        ratingCount: ratings.length,
        userRating
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

// @route   POST /api/stores
// @desc    Create a new store
// @access  Private/Admin
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('address', 'Address cannot exceed 400 characters').isLength({ max: 400 }),
    check('owner_id', 'Owner ID must be a number').optional().isNumeric()
  ],
  validateRequest,
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const { name, email, address, description, contact, hours, owner_id } = req.body;

      // If owner_id is provided, verify it belongs to a store_owner
      if (owner_id) {
        const owner = await User.findByPk(owner_id);
        if (!owner) {
          return res.status(404).json({
            success: false,
            message: 'Owner not found'
          });
        }
        if (owner.role !== 'store_owner') {
          return res.status(400).json({
            success: false,
            message: 'The provided user is not a store owner'
          });
        }
      }

      // Create store
      const store = await Store.create({
        name,
        email,
        address,
        description,
        contact,
        hours,
        owner_id: owner_id || null
      });

      res.status(201).json({
        success: true,
        data: store
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

// @route   PUT /api/stores/:id
// @desc    Update store
// @access  Private/Admin
router.put(
  '/:id',
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail(),
    check('address', 'Address cannot exceed 400 characters').optional().isLength({ max: 400 }),
    check('owner_id', 'Owner ID must be a number').optional().isNumeric()
  ],
  validateRequest,
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const { name, email, address, description, contact, hours, owner_id } = req.body;

      // Check if store exists
      let store = await Store.findByPk(req.params.id);

      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      // If owner_id is provided, verify it belongs to a store_owner
      if (owner_id) {
        const owner = await User.findByPk(owner_id);
        if (!owner) {
          return res.status(404).json({
            success: false,
            message: 'Owner not found'
          });
        }
        if (owner.role !== 'store_owner') {
          return res.status(400).json({
            success: false,
            message: 'The provided user is not a store owner'
          });
        }
      }

      // Update store
      store = await store.update({
        name: name || store.name,
        email: email || store.email,
        address: address || store.address,
        description: description !== undefined ? description : store.description,
        contact: contact !== undefined ? contact : store.contact,
        hours: hours !== undefined ? hours : store.hours,
        owner_id: owner_id !== undefined ? owner_id : store.owner_id
      });

      res.json({
        success: true,
        data: store
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

// @route   GET /api/stores/owner
// @desc    Get stores owned by the current user
// @access  Private/StoreOwner
router.get(
  '/owner',
  protect,
  authorize('store_owner'),
  async (req, res) => {
    try {
      // Find stores owned by this user
      const stores = await Store.findAll({
        where: { owner_id: req.user.id },
        include: [
          {
            model: Rating,
            attributes: ['id', 'rating']
          }
        ]
      });

      // Calculate average rating for each store
      const storesWithRatings = stores.map(store => {
        const ratings = store.Ratings || [];
        const averageRating = ratings.length > 0
          ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
          : 0;

        return {
          ...store.toJSON(),
          averageRating,
          ratingCount: ratings.length
        };
      });

      res.json({
        success: true,
        count: stores.length,
        data: storesWithRatings
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

// @route   GET /api/stores/owner/dashboard
// @desc    Get store owner dashboard data
// @access  Private/StoreOwner
router.get(
  '/owner/dashboard',
  protect,
  authorize('store_owner'),
  async (req, res) => {
    try {
      // Find the store owned by this user
      const store = await Store.findOne({
        where: { owner_id: req.user.id },
        include: [
          {
            model: Rating,
            attributes: ['id', 'rating', 'user_id', 'createdAt', 'updatedAt'],
            include: [
              {
                model: User,
                attributes: ['id', 'name', 'email']
              }
            ]
          }
        ]
      });

      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found for this owner'
        });
      }

      // Calculate average rating
      const ratings = store.Ratings || [];
      const averageRating = ratings.length > 0
        ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
        : null;

      res.json({
        success: true,
        data: {
          store: {
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address
          },
          averageRating,
          ratingCount: ratings.length,
          ratings: ratings.map(rating => ({
            id: rating.id,
            rating: rating.rating,
            user: {
              id: rating.User.id,
              name: rating.User.name,
              email: rating.User.email
            },
            createdAt: rating.createdAt,
            updatedAt: rating.updatedAt
          }))
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
