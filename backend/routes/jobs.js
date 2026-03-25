import express from 'express';
import Job from '../models/Job.js';
import Company from '../models/Company.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      jobType,
      experienceLevel,
      location,
      salaryMin,
      salaryMax,
      skills,
      isRemote,
      company,
      status = 'Active',
      sortBy = 'postedAt',
      sortOrder = 'desc'
    } = req.query;

    let query = { status };

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    // Company filter
    if (company) {
      query.company = { $regex: company, $options: 'i' };
    }

    // Filters
    if (jobType) {
      query.jobType = jobType;
    }
    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (salaryMin) {
      query.salaryMax = { $gte: parseInt(salaryMin) };
    }
    if (salaryMax) {
      query.salaryMin = { $lte: parseInt(salaryMax) };
    }
    if (skills) {
      query.skills = { $in: skills.split(',') };
    }
    if (isRemote === 'true') {
      query.isRemote = true;
    }

    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(query)
      .populate('companyId', 'name logo industry location')
      .populate('postedBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/jobs/featured
// @desc    Get featured jobs
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'Active', isFeatured: true })
      .populate('companyId', 'name logo industry location')
      .sort({ postedAt: -1 })
      .limit(6);

    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Get featured jobs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/jobs/recommended
// @desc    Get recommended jobs for user
// @access  Private
router.get('/recommended', protect, async (req, res) => {
  try {
    const user = req.user;
    let skills = user.skills || [];

    const jobs = await Job.find({
      status: 'Active',
      $or: [
        { skills: { $in: skills } },
        { experienceLevel: 'Entry' }
      ]
    })
      .populate('companyId', 'name logo industry location')
      .sort({ postedAt: -1 })
      .limit(10);

    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Get recommended jobs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/jobs/nearby
// @desc    Get jobs near location
// @access  Public
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query; // radius in km

    // Using geoWithin query for nearby jobs
    // For simplicity, we'll skip exact location matching
    // In production, use MongoDB geospatial queries

    const jobs = await Job.find({ status: 'Active' })
      .populate('companyId', 'name logo industry location')
      .sort({ postedAt: -1 })
      .limit(20);

    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Get nearby jobs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/jobs/stats
// @desc    Get job statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments({ status: 'Active' });
    const totalCompanies = await Company.countDocuments({ status: 'Active' });
    
    const jobsByType = await Job.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$jobType', count: { $sum: 1 } } }
    ]);

    const jobsByExperience = await Job.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$experienceLevel', count: { $sum: 1 } } }
    ]);

    const topLocations = await Job.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      stats: {
        totalJobs,
        totalCompanies,
        jobsByType,
        jobsByExperience,
        topLocations
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('companyId', 'name logo industry location website description employees size cultureImages')
      .populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (Employer)
router.post('/', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const {
      title,
      companyId,
      description,
      requirements,
      responsibilities,
      salaryMin,
      salaryMax,
      salary,
      location,
      lat,
      lng,
      jobType,
      experienceLevel,
      skills,
      benefits,
      isRemote,
      easyApply,
      expiredAt
    } = req.body;

    // Verify company ownership
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (company.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to post jobs for this company' });
    }

    const job = await Job.create({
      title,
      company: company.name,
      companyId,
      companyLogo: company.logo,
      description,
      requirements,
      responsibilities,
      salaryMin,
      salaryMax,
      salary,
      location,
      lat,
      lng,
      jobType,
      experienceLevel,
      skills,
      benefits,
      postedBy: req.user._id,
      isRemote,
      easyApply,
      expiredAt
    });

    await job.populate('companyId', 'name logo');

    res.status(201).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private (Employer)
router.put('/:id', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const {
      title,
      description,
      requirements,
      responsibilities,
      salaryMin,
      salaryMax,
      salary,
      location,
      lat,
      lng,
      jobType,
      experienceLevel,
      skills,
      benefits,
      status,
      isRemote,
      easyApply,
      expiredAt
    } = req.body;

    job = await Job.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        requirements,
        responsibilities,
        salaryMin,
        salaryMax,
        salary,
        location,
        lat,
        lng,
        jobType,
        experienceLevel,
        skills,
        benefits,
        status,
        isRemote,
        easyApply,
        expiredAt,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('companyId', 'name logo');

    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private (Employer)
router.delete('/:id', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/jobs/my-jobs
// @desc    Get employer's jobs
// @access  Private (Employer)
router.get('/employer/my-jobs', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = { postedBy: req.user._id };
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(query)
      .populate('companyId', 'name logo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get employer jobs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/jobs/:id/view
// @desc    Increment job views
// @access  Public
router.put('/:id/view', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.views += 1;
    await job.save();

    res.json({ success: true, views: job.views });
  } catch (error) {
    console.error('Increment job views error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
