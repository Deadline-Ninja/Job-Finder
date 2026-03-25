import express from 'express';
import SavedJob from '../models/SavedJob.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/saved-jobs
// @desc    Save a job
// @access  Private (Job Seeker)
router.post('/', protect, async (req, res) => {
  try {
    const { jobId, notes } = req.body;

    // Check if already saved
    const existing = await SavedJob.findOne({
      userId: req.user._id,
      jobId
    });

    if (existing) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    const savedJob = await SavedJob.create({
      userId: req.user._id,
      jobId,
      notes
    });

    res.status(201).json({
      success: true,
      savedJob
    });
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/saved-jobs
// @desc    Get all saved jobs
// @access  Private (Job Seeker)
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const savedJobs = await SavedJob.find({ userId: req.user._id })
      .populate({
        path: 'jobId',
        populate: {
          path: 'companyId',
          select: 'name logo industry location'
        }
      })
      .sort({ savedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SavedJob.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      savedJobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/saved-jobs/:jobId
// @desc    Check if job is saved
// @access  Private (Job Seeker)
router.get('/:jobId', protect, async (req, res) => {
  try {
    const savedJob = await SavedJob.findOne({
      userId: req.user._id,
      jobId: req.params.jobId
    });

    res.json({
      success: true,
      isSaved: !!savedJob,
      savedJob
    });
  } catch (error) {
    console.error('Check saved job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/saved-jobs/:id
// @desc    Update saved job notes
// @access  Private (Job Seeker)
router.put('/:id', protect, async (req, res) => {
  try {
    const { notes } = req.body;

    const savedJob = await SavedJob.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { notes },
      { new: true }
    ).populate({
      path: 'jobId',
      populate: {
        path: 'companyId',
        select: 'name logo industry location'
      }
    });

    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    res.json({
      success: true,
      savedJob
    });
  } catch (error) {
    console.error('Update saved job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/saved-jobs/:id
// @desc    Unsave a job
// @access  Private (Job Seeker)
router.delete('/:id', protect, async (req, res) => {
  try {
    const savedJob = await SavedJob.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    res.json({
      success: true,
      message: 'Job unsaved successfully'
    });
  } catch (error) {
    console.error('Delete saved job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/saved-jobs/job/:jobId
// @desc    Unsave a job by jobId
// @access  Private (Job Seeker)
router.delete('/job/:jobId', protect, async (req, res) => {
  try {
    const savedJob = await SavedJob.findOneAndDelete({
      userId: req.user._id,
      jobId: req.params.jobId
    });

    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    res.json({
      success: true,
      message: 'Job unsaved successfully'
    });
  } catch (error) {
    console.error('Delete saved job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
