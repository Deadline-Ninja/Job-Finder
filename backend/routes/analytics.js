import express from 'express';
import mongoose from 'mongoose';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import Company from '../models/Company.js';
import SavedJob from '../models/SavedJob.js';
import Notification from '../models/Notification.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

const router = express.Router();

// Get employer analytics
router.get('/employer', async (req, res) => {
  try {
    const employerId = req.query.employerId;
    
    if (!employerId) {
      return res.status(400).json({ message: 'Employer ID is required' });
    }

    // Get jobs posted by this employer
    const jobs = await Job.find({ postedBy: employerId });
    const jobIds = jobs.map(job => job._id);

    // Get applications for employer's jobs
    const applications = await Application.find({ jobId: { $in: jobIds } });
    
    // Calculate stats
    const totalApplications = applications.length;
    const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);
    
    // Status breakdown
    const statusCounts = {
      Applied: applications.filter(a => a.status === 'Applied').length,
      Viewed: applications.filter(a => a.status === 'Viewed').length,
      Shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
      Interview: applications.filter(a => a.status === 'Interview').length,
      Offer: applications.filter(a => a.status === 'Offer').length,
      Rejected: applications.filter(a => a.status === 'Rejected').length
    };

    // Monthly data for charts (last 6 months)
    const monthlyData = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthApplications = applications.filter(a => {
        const appDate = new Date(a.appliedAt);
        return appDate >= monthStart && appDate <= monthEnd;
      });
      
      const monthJobs = jobs.filter(j => {
        const postDate = new Date(j.postedAt);
        return postDate >= monthStart && postDate <= monthEnd;
      });
      
      monthlyData.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        applications: monthApplications.length,
        views: monthJobs.reduce((sum, job) => sum + (job.views || 0), 0),
        hires: monthApplications.filter(a => a.status === 'Offer').length
      });
    }

    // Top performing jobs
    const topJobs = jobs
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
      .map(job => ({
        _id: job._id,
        title: job.title,
        company: job.company,
        views: job.views || 0,
        applications: job.applications || 0,
        conversionRate: job.views > 0 ? ((job.applications / job.views) * 100).toFixed(1) : 0
      }));

    // Application sources (simulated based on status)
    const sourceData = [
      { name: 'Direct', value: 35, color: '#C9A227' },
      { name: 'Job Boards', value: 30, color: '#0F172A' },
      { name: 'Social Media', value: 20, color: '#1E293B' },
      { name: 'Referrals', value: 15, color: '#94A3B8' }
    ];

    // Calculate trends (comparing to previous period)
    const currentMonth = monthlyData[5];
    const previousMonth = monthlyData[4];
    
    const appTrend = previousMonth.applications > 0 
      ? ((currentMonth.applications - previousMonth.applications) / previousMonth.applications * 100).toFixed(0)
      : 0;
    
    const viewsTrend = previousMonth.views > 0
      ? ((currentMonth.views - previousMonth.views) / previousMonth.views * 100).toFixed(0)
      : 0;

    // Average time to hire (in days) - simulated
    const avgTimeToHire = 18;
    const avgTimeTrend = -5;

    // Cost per hire - simulated
    const costPerHire = 450;
    const costTrend = 3;

    res.json({
      stats: {
        totalApplications,
        totalViews,
        avgTimeToHire,
        costPerHire,
        appTrend: parseInt(appTrend),
        viewsTrend: parseInt(viewsTrend),
        avgTimeTrend,
        costTrend
      },
      monthlyData,
      statusCounts,
      topJobs,
      sourceData
    });
  } catch (error) {
    console.error('Error fetching employer analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get job seeker analytics
router.get('/jobseeker', async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Get user's applications
    const applications = await Application.find({ userId });
    
    // Get saved jobs
    const savedJobs = await SavedJob.find({ userId });
    
    // Get user's notifications
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    const unreadNotifications = notifications.filter(n => !n.read).length;
    
    // Get user's conversations
    const conversations = await Conversation.find({ participants: userId });
    const conversationIds = conversations.map(c => c._id);
    const unreadMessages = await Message.countDocuments({ 
      conversationId: { $in: conversationIds },
      sender: { $ne: userId },
      read: false 
    });

    // Application status breakdown
    const statusCounts = {
      Applied: applications.filter(a => a.status === 'Applied').length,
      Viewed: applications.filter(a => a.status === 'Viewed').length,
      Shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
      Interview: applications.filter(a => a.status === 'Interview').length,
      Offer: applications.filter(a => a.status === 'Offer').length,
      Rejected: applications.filter(a => a.status === 'Rejected').length
    };

    // Monthly application data
    const monthlyData = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthApplications = applications.filter(a => {
        const appDate = new Date(a.appliedAt);
        return appDate >= monthStart && appDate <= monthEnd;
      });
      
      monthlyData.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        applications: monthApplications.length,
        responses: monthApplications.filter(a => ['Viewed', 'Shortlisted', 'Interview', 'Offer'].includes(a.status)).length
      });
    }

    // Success rate
    const totalApplications = applications.length;
    const successfulApplications = applications.filter(a => 
      ['Shortlisted', 'Interview', 'Offer'].includes(a.status)
    ).length;
    const successRate = totalApplications > 0 
      ? ((successfulApplications / totalApplications) * 100).toFixed(1) 
      : 0;

    res.json({
      stats: {
        totalApplications,
        savedJobsCount: savedJobs.length,
        unreadNotifications,
        unreadMessages,
        successRate: parseFloat(successRate)
      },
      monthlyData,
      statusCounts,
      recentNotifications: notifications.slice(0, 10)
    });
  } catch (error) {
    console.error('Error fetching job seeker analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get overall platform analytics (admin)
router.get('/admin', async (req, res) => {
  try {
    const [
      totalUsers,
      totalJobSeekers,
      totalEmployers,
      totalCompanies,
      totalJobs,
      totalApplications,
      totalMessages
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'jobseeker' }),
      User.countDocuments({ role: 'employer' }),
      Company.countDocuments(),
      Job.countDocuments({ status: 'Active' }),
      Application.countDocuments(),
      Message.countDocuments()
    ]);

    // Jobs by type
    const jobsByType = await Job.aggregate([
      { $group: { _id: '$jobType', count: { $sum: 1 } } }
    ]);

    // Jobs by experience level
    const jobsByExperience = await Job.aggregate([
      { $group: { _id: '$experienceLevel', count: { $sum: 1 } } }
    ]);

    // Monthly growth
    const monthlyGrowth = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const [newJobs, newApplications, newUsers] = await Promise.all([
        Job.countDocuments({ postedAt: { $gte: monthStart, $lte: monthEnd } }),
        Application.countDocuments({ appliedAt: { $gte: monthStart, $lte: monthEnd } }),
        User.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } })
      ]);
      
      monthlyGrowth.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        jobs: newJobs,
        applications: newApplications,
        users: newUsers
      });
    }

    // Top companies by jobs
    const topCompanies = await Job.aggregate([
      { $group: { _id: '$companyId', jobCount: { $sum: 1 }, totalViews: { $sum: '$views' } } },
      { $sort: { jobCount: -1 } },
      { $limit: 5 }
    ]);

    // Populate company details
    const companyIds = topCompanies.map(c => c._id);
    const companies = await Company.find({ _id: { $in: companyIds } });
    
    const topCompaniesWithDetails = topCompanies.map(c => {
      const company = companies.find(comp => comp._id.toString() === c._id.toString());
      return {
        name: company?.name || 'Unknown',
        industry: company?.industry || 'Unknown',
        jobCount: c.jobCount,
        totalViews: c.totalViews
      };
    });

    res.json({
      overview: {
        totalUsers,
        totalJobSeekers,
        totalEmployers,
        totalCompanies,
        totalActiveJobs: totalJobs,
        totalApplications,
        totalMessages,
        totalKYCVerified: await User.countDocuments({ isKYCVerified: true })
      },
      jobsByType,
      jobsByExperience,
      monthlyGrowth,
      topCompanies: topCompaniesWithDetails
    });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Alias for common stats endpoint
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalCompanies] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments({ status: 'Active' }),
      Company.countDocuments()
    ]);
    res.json({ success: true, stats: { users: totalUsers, jobs: totalJobs, companies: totalCompanies } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Stats error' });
  }
});

// Test endpoint to verify database connection
router.get('/test', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    const counts = {};
    for (const name of collectionNames) {
      counts[name] = await mongoose.connection.db.collection(name).countDocuments();
    }

    res.json({
      status: 'success',
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      collections: counts
    });
  } catch (error) {
    console.error('Error testing database:', error);
    res.status(500).json({ message: 'Database test failed', error: error.message });
  }
});

export default router;
