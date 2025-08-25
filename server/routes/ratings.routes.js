const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validateRequest = require('../middleware/validator');
const { protect, authorize } = require('../middleware/auth');
const Rating = require('../models/Rating');
const Store = require('../models/Store');

// @route   POST /api/ratings
// @desc    Submit a rating for a store
// @access  Private
router.post(
  '/',
  [
    check('store_id', 'Store ID is required').isNumeric(),
    check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 })
  ],
  validateRequest,
  protect,
  async (req, res) => {
    try {
      const { store_id, rating } = req.body;
      const user_id = req.user.id;

      // Check if store exists
      const store = await Store.findByPk(store_id);
      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      // Check if user has already rated this store
      const existingRating = await Rating.findOne({
        where: { user_id, store_id }
      });

      if (existingRating) {
        return res.status(400).json({
          success: false,
          message: 'You have already rated this store. Use PUT to update your rating.'
        });
      }

      // Create rating
      const newRating = await Rating.create({
        user_id,
        store_id,
        rating
      });

      res.status(201).json({
        success: true,
        data: newRating
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

// @route   PUT /api/ratings/:store_id
// @desc    Update a rating for a store
// @access  Private
router.put(
  '/:store_id',
  [
    check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 })
  ],
  validateRequest,
  protect,
  async (req, res) => {
    try {
      const { rating } = req.body;
      const { store_id } = req.params;
      const user_id = req.user.id;

      // Check if store exists
      const store = await Store.findByPk(store_id);
      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      // Find the rating
      let existingRating = await Rating.findOne({
        where: { user_id, store_id }
      });

      if (!existingRating) {
        return res.status(404).json({
          success: false,
          message: 'Rating not found'
        });
      }

      // Update rating
      existingRating = await existingRating.update({ rating });

      res.json({
        success: true,
        data: existingRating
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

// @route   GET /api/ratings/user
// @desc    Get all ratings by the current user
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Store,
          attributes: ['id', 'name', 'email', 'address']
        }
      ]
    });

    res.json({
      success: true,
      count: ratings.length,
      data: ratings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/ratings/stats
// @desc    Get rating statistics (admin only)
// @access  Private/Admin
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    // Get total number of ratings
    const totalRatings = await Rating.count();

    // Get average rating per store
    const storeRatings = await Rating.findAll({
      attributes: [
        'store_id',
        [Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'ratingCount']
      ],
      group: ['store_id'],
      include: [
        {
          model: Store,
          attributes: ['name']
        }
      ]
    });

    // Get rating distribution (count of each rating value)
    const ratingDistribution = await Rating.findAll({
      attributes: [
        'rating',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['rating'],
      order: [['rating', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        totalRatings,
        storeRatings,
        ratingDistribution
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
