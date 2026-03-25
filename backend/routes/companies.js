import express from 'express';
import Company from '../models/Company.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/companies
// @desc    Get all companies with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      industry,
      size,
      location,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    let query = { status: 'Active' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } }
      ];
    }

    if (industry) {
      query.industry = industry;
    }

    if (size) {
      query.size = size;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const companies = await Company.find(query)
      .select('-cultureImages')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Company.countDocuments(query);

    res.json({
      success: true,
      companies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/companies/featured
// @desc    Get featured companies
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const companies = await Company.find({ status: 'Active', isFeatured: true })
      .select('-cultureImages')
      .sort({ name: 1 })
      .limit(10);

    res.json({ success: true, companies });
  } catch (error) {
    console.error('Get featured companies error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/companies/industries
// @desc    Get all unique industries
// @access  Public
router.get('/industries', async (req, res) => {
  try {
    const industries = await Company.distinct('industry', { status: 'Active' });
    res.json({ success: true, industries: industries.filter(Boolean) });
  } catch (error) {
    console.error('Get industries error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/companies/:id
// @desc    Get single company by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Increment profile views
    company.profileViews += 1;
    await company.save();

    res.json({ success: true, company });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/companies/:id/jobs
// @desc    Get company's active jobs
// @access  Public
router.get('/:id/jobs', async (req, res) => {
  try {
    const Job = (await import('../models/Job.js')).default;

    const jobs = await Job.find({ companyId: req.params.id, status: 'Active' })
      .sort({ postedAt: -1 });

    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Get company jobs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/companies/:id/reviews
// @desc    Get company's reviews
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const Review = (await import('../models/Review.js')).default;

    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ companyId: req.params.id, status: 'Approved' })
      .populate('userId', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ companyId: req.params.id, status: 'Approved' });

    // Calculate average rating
    const avgRating = await Review.aggregate([
      { $match: { companyId: req.params.id, status: 'Approved' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    res.json({
      success: true,
      reviews,
      rating: avgRating[0]?.avgRating || 0,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get company reviews error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/companies
// @desc    Create a new company
// @access  Private (Employer)
router.post('/', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const {
      name,
      logo,
      industry,
      location,
      lat,
      lng,
      website,
      description,
      size,
      founded,
      culture,
      benefits,
      socialLinks
    } = req.body;

    const company = await Company.create({
      name,
      logo,
      industry,
      location,
      lat,
      lng,
      website,
      description,
      size,
      founded,
      culture,
      benefits,
      socialLinks,
      owner: req.user._id,
      status: 'Active'
    });

    res.status(201).json({
      success: true,
      company
    });
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/companies/:id
// @desc    Update a company
// @access  Private (Company Owner)
router.put('/:id', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check ownership
    if (company.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this company' });
    }

    const {
      name,
      logo,
      industry,
      location,
      lat,
      lng,
      website,
      description,
      size,
      founded,
      culture,
      benefits,
      socialLinks,
      status
    } = req.body;

    company = await Company.findByIdAndUpdate(
      req.params.id,
      {
        name,
        logo,
        industry,
        location,
        lat,
        lng,
        website,
        description,
        size,
        founded,
        culture,
        benefits,
        socialLinks,
        status,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      company
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/companies/:id
// @desc    Delete a company
// @access  Private (Company Owner)
router.delete('/:id', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check ownership
    if (company.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this company' });
    }

    await company.deleteOne();

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/companies/my/company
// @desc    Get current user's company
// @access  Private (Employer)
router.get('/employer/my-company', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user._id });
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({ success: true, company });
  } catch (error) {
    console.error('Get my company error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
