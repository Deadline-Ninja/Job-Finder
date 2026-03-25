import express from 'express';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/applications
// @desc    Apply for a job
// @access  Private (Job Seeker)
router.post('/', protect, async (req, res) => {
  try {
    const { jobId, resume, coverLetter } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId,
      userId: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const application = await Application.create({
      jobId,
      userId: req.user._id,
      resume: resume || req.user.resume,
      coverLetter,
      timeline: [{
        status: 'Applied',
        note: 'Application submitted',
        date: Date.now()
      }]
    });

    // Update job application count
    job.applications += 1;
    await job.save();

    // Create notification for employer
    const companyOwnerId = job.postedBy;
    const notification = await Notification.create({
      userId: companyOwnerId,
      type: 'application_received',
      title: 'New Application',
      message: `You received a new application for ${job.title}`,
      data: {
        jobId: job._id,
        applicationId: application._id
      }
    });

    // Emit notification socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${companyOwnerId}`).emit('newNotification', notification);
    }

    await application.populate([
      { path: 'jobId', select: 'title company' },
      { path: 'userId', select: 'name email profilePhoto' }
    ]);

    res.status(201).json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/applications/my
// @desc    Get current user's applications
// @access  Private (Job Seeker)
router.get('/my', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = { userId: req.user._id };
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(query)
      .populate('jobId', 'title company location salary jobType postedAt')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/applications/:id
// @desc    Get single application
// @access  Private (Job Seeker or Employer)
router.get('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId')
      .populate('userId', 'name email profilePhoto phone skills experience education resume');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check authorization
    const isOwner = application.userId._id.toString() === req.user._id.toString();
    const isEmployer = req.user.role === 'employer' || req.user.role === 'admin';

    // Employer can only view applications for their jobs
    if (!isOwner && isEmployer) {
      const job = await Job.findById(application.jobId._id);
      if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this application' });
      }
    }

    // If job seeker, only they can view their application
    if (!isOwner && !isEmployer) {
      return res.status(403).json({ message: 'Not authorized to view this application' });
    }

    // Mark as viewed if employer
    if (isEmployer && !application.timeline.some(t => t.status === 'Viewed')) {
      application.status = 'Viewed';
      application.timeline.push({
        status: 'Viewed',
        note: 'Application viewed by employer',
        date: Date.now()
      });
      await application.save();

      // Notify job seeker
      const userNotification = await Notification.create({
        userId: application.userId._id,
        type: 'application_viewed',
        title: 'Application Viewed',
        message: `Your application for ${job.title} has been viewed`,
        data: {
          jobId: application.jobId._id,
          applicationId: application._id
        }
      });

      // Emit notification socket event
      if (io) {
        io.to(`user_${application.userId._id}`).emit('newNotification', userNotification);
      }
    }

    res.json({ success: true, application });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/applications/:id
// @desc    Update application status (Employer)
// @access  Private (Employer)
router.put('/:id', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('jobId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify employer owns the job
    const job = await Job.findById(application.jobId);
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    if (notes) {
      application.notes = notes;
    }

    application.timeline.push({
      status,
      note: notes || `Status changed to ${status}`,
      date: Date.now()
    });

    await application.save();

    // Create notification for job seeker
    const notificationType = {
      'Shortlisted': 'application_shortlisted',
      'Rejected': 'application_rejected',
      'Interview': 'interview_scheduled',
      'Offer': 'application_offer'
    };

    if (notificationType[status]) {
      const statusNotification = await Notification.create({
        userId: application.userId,
        type: notificationType[status],
        title: `Application ${status}`,
        message: `Your application for ${job.title} has been ${status.toLowerCase()}`,
        data: {
          jobId: job._id,
          applicationId: application._id
        }
      });

      // Emit notification socket event
      if (io) {
        io.to(`user_${application.userId}`).emit('newNotification', statusNotification);
      }
    }

    await application.populate([
      { path: 'jobId', select: 'title company' },
      { path: 'userId', select: 'name email profilePhoto' }
    ]);

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Withdraw application
// @access  Private (Job Seeker)
router.delete('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only owner can withdraw
    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to withdraw this application' });
    }

    // Update status to withdrawn
    application.status = 'Withdrawn';
    application.timeline.push({
      status: 'Withdrawn',
      note: 'Application withdrawn by candidate',
      date: Date.now()
    });
    await application.save();

    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/applications/employer/all
// @desc    Get all applications for all employer's jobs
// @access  Private (Employer)
router.get('/employer/all', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    // Get all jobs posted by this employer
    const jobs = await Job.find({ postedBy: req.user._id });
    const jobIds = jobs.map(job => job._id);

    let query = { jobId: { $in: jobIds } };
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(query)
      .populate('userId', 'name email profilePhoto phone skills')
      .populate('jobId', 'title company location')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    // Get status counts
    const statusCounts = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      applications,
      statusCounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all employer applications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get all applications for a job (Employer)
// @access  Private (Employer)
router.get('/job/:jobId', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    // Verify job ownership
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view applications for this job' });
    }

    let query = { jobId: req.params.jobId };
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(query)
      .populate('userId', 'name email profilePhoto phone skills')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    // Get status counts
    const statusCounts = await Application.aggregate([
      { $match: { jobId: job._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      applications,
      statusCounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
