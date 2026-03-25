import express from 'express';
import Review from '../models/Review.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/reviews
// @desc    Create a review for a company
// @access  Private (Job Seeker)
router.post('/', protect, async (req, res) => {
  try {
    const { companyId, rating, title, content, pros, cons, isAnonymous } = req.body;

    // Check if user already reviewed this company
    const existing = await Review.findOne({
      userId: req.user._id,
      companyId
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this company' });
    }

    const review = await Review.create({
      companyId,
      userId: req.user._id,
      rating,
      title,
      content,
      pros,
      cons,
      isAnonymous,
      isVerified: false, // In production, check if user worked at company
      status: 'Pending' // Reviews need approval
    });

    res.status(201).json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/reviews/company/:companyId
// @desc    Get reviews for a company
// @access  Public
router.get('/company/:companyId', async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;

    let query = { companyId: req.params.companyId, status: 'Approved' };
    if (rating) {
      query.rating = parseInt(rating);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find(query)
      .populate('userId', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(query);

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { companyId: req.params.companyId, status: 'Approved' } },
      { $group: { _id: '$rating', count: { $sum: 1 } } }
    ]);

    // Calculate average
    const avgRating = await Review.aggregate([
      { $match: { companyId: req.params.companyId, status: 'Approved' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    res.json({
      success: true,
      reviews,
      rating: avgRating[0]?.avgRating || 0,
      ratingDistribution,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { rating, title, content, pros, cons } = req.body;

    let review = await Review.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Only allow update if still pending
    if (review.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot update approved/rejected reviews' });
    }

    review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, title, content, pros, cons, updatedAt: Date.now() },
      { new: true }
    ).populate('userId', 'name profilePhoto');

    res.json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.post('/:id/helpful', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.helpful += 1;
    await review.save();

    res.json({
      success: true,
      helpful: review.helpful
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
