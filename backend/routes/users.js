import express from 'express';
import User from '../models/User.js';
import Company from '../models/Company.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registry access failure' });
  }
});

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/profile/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const {
      name,
      headline,
      summary,
      location,
      phone,
      website,
      linkedin,
      github,
      skills,
      experience,
      education,
      portfolio,
      resume,
      profilePhoto
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (headline) user.headline = headline;
    if (summary) user.summary = summary;
    if (location) user.location = location;
    if (phone) user.phone = phone;
    if (website) user.website = website;
    if (linkedin) user.linkedin = linkedin;
    if (github) user.github = github;
    if (skills) user.skills = skills;
    if (experience) user.experience = experience;
    if (education) user.education = education;
    if (portfolio) user.portfolio = portfolio;
    if (resume) user.resume = resume;
    if (profilePhoto) user.profilePhoto = profilePhoto;

    // Calculate profile completion
    const fields = [name, headline, summary, location, phone, skills, experience, education, resume];
    user.profileCompleted = fields.filter(f => f).length / fields.length * 100;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        headline: user.headline,
        summary: user.summary,
        location: user.location,
        phone: user.phone,
        website: user.website,
        linkedin: user.linkedin,
        github: user.github,
        skills: user.skills,
        experience: user.experience,
        education: user.education,
        portfolio: user.portfolio,
        resume: user.resume,
        profilePhoto: user.profilePhoto,
        profileCompleted: user.profileCompleted
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/users/profile-photo
// @desc    Update profile photo
// @access  Private
router.put('/profile-photo', protect, async (req, res) => {
  try {
    const { profilePhoto } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.profilePhoto = profilePhoto;
    await user.save();
    res.json({ success: true, profilePhoto: user.profilePhoto });
  } catch (error) {
    console.error('Update photo error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/users/resume
// @desc    Update resume
// @access  Private
router.put('/resume', protect, async (req, res) => {
  try {
    const { resume } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.resume = resume;
    await user.save();
    res.json({ success: true, resume: user.resume });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/dashboard-stats
// @desc    Get user dashboard stats
// @access  Private
router.get('/dashboard-stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Import models dynamically to avoid circular imports
    const Application = (await import('../models/Application.js')).default;
    const SavedJob = (await import('../models/SavedJob.js')).default;
    const Job = (await import('../models/Job.js')).default;

    // Get application stats
    const applications = await Application.find({ userId: req.user._id });
    const applicationStats = {
      total: applications.length,
      pending: applications.filter(a => a.status === 'Applied' || a.status === 'Viewed').length,
      interview: applications.filter(a => a.status === 'Interview').length,
      offer: applications.filter(a => a.status === 'Offer').length,
      rejected: applications.filter(a => a.status === 'Rejected').length
    };

    // Get saved jobs count
    const savedJobs = await SavedJob.countDocuments({ userId: req.user._id });

    // Get profile views (mock for now)
    const profileViews = user.profileViews || 0;

    // Get recommended jobs
    const recommendedJobs = await Job.find({
      status: 'Active',
      $or: [
        { skills: { $in: user.skills || [] } },
        { experienceLevel: 'Entry' }
      ]
    })
    .populate('companyId', 'name logo')
    .sort({ postedAt: -1 })
    .limit(5);

    res.json({
      success: true,
      stats: {
        profileCompleted: user.profileCompleted || 0,
        profileViews,
        applicationStats,
        savedJobs,
        recommendedJobs
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/search
// @desc    Search users (for employer search)
// @access  Private (employer)
router.get('/search', protect, async (req, res) => {
  try {
    let { skills, location, experience, role = 'seeker' } = req.query;

    // Normalize role
    const searchRole = role === 'jobseeker' ? 'seeker' : role;
    let query = { role: searchRole };

    if (skills) {
      query.skills = { $in: skills.split(',') };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (experience) {
      query['experience.level'] = experience;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
