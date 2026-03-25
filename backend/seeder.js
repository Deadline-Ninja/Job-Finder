import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Company from './models/Company.js';
import Job from './models/Job.js';
import Application from './models/Application.js';
import Message from './models/Message.js';
import Conversation from './models/Conversation.js';
import Notification from './models/Notification.js';
import SavedJob from './models/SavedJob.js';
import Review from './models/Review.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// Helper to generate random dates within a range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper to generate random items from array
const randomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const seedUsers = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const users = [
    // Job Seekers
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'seeker',
      headline: 'Full Stack Developer',
      location: 'New York, NY',
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      profileCompleted: 90,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
      role: 'employer',
      headline: 'HR Manager at TechCorp',
      location: 'San Francisco, CA',
      profileCompleted: 100,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'
    },
    {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      password: hashedPassword,
      role: 'seeker',
      headline: 'UI/UX Designer',
      location: 'Austin, TX',
      skills: ['Figma', 'Adobe XD', 'React', 'CSS'],
      profileCompleted: 75,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
    },
    {
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      password: hashedPassword,
      role: 'employer',
      headline: 'CEO at StartupHub',
      location: 'Seattle, WA',
      profileCompleted: 100,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
    },
    // Additional job seekers
    {
      name: 'David Brown',
      email: 'david@example.com',
      password: hashedPassword,
      role: 'seeker',
      headline: 'Data Scientist',
      location: 'Boston, MA',
      skills: ['Python', 'TensorFlow', 'SQL', 'Machine Learning'],
      profileCompleted: 85,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david'
    },
    {
      name: 'Emily Davis',
      email: 'emily@example.com',
      password: hashedPassword,
      role: 'seeker',
      headline: 'DevOps Engineer',
      location: 'Chicago, IL',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
      profileCompleted: 80,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily'
    },
    {
      name: 'Chris Wilson',
      email: 'chris@example.com',
      password: hashedPassword,
      role: 'seeker',
      headline: 'Product Manager',
      location: 'Denver, CO',
      skills: ['Agile', 'Jira', 'Data Analysis', 'Product Strategy'],
      profileCompleted: 70,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris'
    },
    {
      name: 'Amanda Taylor',
      email: 'amanda@example.com',
      password: hashedPassword,
      role: 'seeker',
      headline: 'Frontend Developer',
      location: 'Miami, FL',
      skills: ['React', 'Vue.js', 'TypeScript', 'Tailwind CSS'],
      profileCompleted: 95,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amanda'
    },
    {
      name: 'System Administrator',
      email: 'admin@jobfinder.com',
      password: hashedPassword,
      role: 'admin',
      headline: 'Platform Controller',
      location: 'Central Node',
      profileCompleted: 100,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
    },
    // Additional employers
    {
      name: 'Robert Chen',
      email: 'robert@example.com',
      password: hashedPassword,
      role: 'employer',
      headline: 'CTO at DataFlow Inc',
      location: 'New York, NY',
      profileCompleted: 100,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert'
    },
    {
      name: 'Lisa Martinez',
      email: 'lisa@example.com',
      password: hashedPassword,
      role: 'employer',
      headline: 'VP of Engineering at CloudNine',
      location: 'Seattle, WA',
      profileCompleted: 100,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa'
    }
  ];

  await User.deleteMany({});
  const createdUsers = await User.insertMany(users);
  console.log('Users seeded');
  return createdUsers;
};

const seedCompanies = async (users) => {
  const employerUsers = users.filter(u => u.role === 'employer');

  const companies = [
    {
      name: 'TechCorp',
      logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=techcorp',
      industry: 'Technology',
      location: 'San Francisco, CA',
      lat: 37.7749,
      lng: -122.4194,
      website: 'https://techcorp.example.com',
      description: 'Leading technology company specializing in cloud solutions and enterprise software.',
      size: '500-1000',
      foundedYear: 2010,
      isFeatured: true,
      owner: employerUsers[0]?._id,
      status: 'Active'
    },
    {
      name: 'StartupHub',
      logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=startuphub',
      industry: 'Startups',
      location: 'Austin, TX',
      lat: 30.2672,
      lng: -97.7431,
      website: 'https://startuphub.example.com',
      description: 'Fast-growing startup focused on disrupting the recruitment industry.',
      size: '51-200',
      foundedYear: 2020,
      isFeatured: true,
      owner: employerUsers[1]?._id,
      status: 'Active'
    },
    {
      name: 'DataFlow Inc',
      logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=dataflow',
      industry: 'Data Science',
      location: 'New York, NY',
      lat: 40.7128,
      lng: -74.0060,
      website: 'https://dataflow.example.com',
      description: 'Data analytics and machine learning company.',
      size: '201-500',
      foundedYear: 2015,
      isFeatured: false,
      owner: employerUsers[2]?._id,
      status: 'Active'
    },
    {
      name: 'CloudNine',
      logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=cloudnine',
      industry: 'Cloud Computing',
      location: 'Seattle, WA',
      lat: 47.6062,
      lng: -122.3321,
      website: 'https://cloudnine.example.com',
      description: 'Cloud infrastructure and DevOps solutions.',
      size: '500-1000',
      foundedYear: 2018,
      isFeatured: true,
      owner: employerUsers[3]?._id,
      status: 'Active'
    },
    {
      name: 'InnovateTech',
      logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=innovatetech',
      industry: 'Software',
      location: 'Boston, MA',
      lat: 42.3601,
      lng: -71.0589,
      website: 'https://innovatetech.example.com',
      description: 'Innovative software solutions for enterprise clients.',
      size: '201-500',
      foundedYear: 2016,
      isFeatured: false,
      owner: employerUsers[0]?._id,
      status: 'Active'
    }
  ];

  await Company.deleteMany({});
  const createdCompanies = await Company.insertMany(companies);
  console.log('Companies seeded');
  return createdCompanies;
};

const seedJobs = async (users, companies) => {
  const employerUsers = users.filter(u => u.role === 'employer');

  const jobs = [
    {
      title: 'Senior Full Stack Developer',
      company: 'TechCorp',
      companyId: companies[0]._id,
      companyLogo: companies[0].logo,
      description: 'We are looking for an experienced Full Stack Developer to join our team. You will be working on cutting-edge web applications.',
      requirements: ['5+ years of experience', 'React & Node.js expertise', 'Strong database skills'],
      responsibilities: ['Lead development projects', 'Mentor junior developers', 'Code reviews'],
      salaryMin: 120000,
      salaryMax: 180000,
      salary: '$120k - $180k',
      location: 'San Francisco, CA',
      lat: 37.7749,
      lng: -122.4194,
      jobType: 'Full-time',
      experienceLevel: 'Senior',
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS'],
      benefits: ['Health Insurance', '401k', 'Remote Work', 'Unlimited PTO'],
      postedBy: employerUsers[0]._id,
      status: 'Active',
      isFeatured: true,
      isRemote: false,
      easyApply: true,
      views: Math.floor(Math.random() * 2000) + 500,
      applications: Math.floor(Math.random() * 50) + 10,
      postedAt: randomDate(new Date(2024, 0, 1), new Date(2024, 5, 30))
    },
    {
      title: 'UI/UX Designer',
      company: 'StartupHub',
      companyId: companies[1]._id,
      companyLogo: companies[1].logo,
      description: 'Join our design team to create beautiful and intuitive user interfaces for our recruitment platform.',
      requirements: ['3+ years of UI/UX experience', 'Figma expertise', 'Portfolio required'],
      responsibilities: ['Design user interfaces', 'Create prototypes', 'Conduct user research'],
      salaryMin: 90000,
      salaryMax: 130000,
      salary: '$90k - $130k',
      location: 'Austin, TX',
      lat: 30.2672,
      lng: -97.7431,
      jobType: 'Full-time',
      experienceLevel: 'Mid',
      skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
      benefits: ['Health Insurance', 'Stock Options', 'Flexible Hours'],
      postedBy: employerUsers[1]._id,
      status: 'Active',
      isFeatured: true,
      isRemote: true,
      easyApply: true,
      views: Math.floor(Math.random() * 1500) + 400,
      applications: Math.floor(Math.random() * 40) + 15,
      postedAt: randomDate(new Date(2024, 0, 1), new Date(2024, 5, 30))
    },
    {
      title: 'Data Scientist',
      company: 'DataFlow Inc',
      companyId: companies[2]._id,
      companyLogo: companies[2].logo,
      description: 'We need a Data Scientist to help us build ML models for our recruitment algorithms.',
      requirements: ['MS in Computer Science or related field', 'Python & ML expertise', 'Experience with large datasets'],
      responsibilities: ['Build ML models', 'Analyze data', 'Present insights'],
      salaryMin: 130000,
      salaryMax: 200000,
      salary: '$130k - $200k',
      location: 'New York, NY',
      lat: 40.7128,
      lng: -74.0060,
      jobType: 'Full-time',
      experienceLevel: 'Senior',
      skills: ['Python', 'TensorFlow', 'SQL', 'Machine Learning'],
      benefits: ['Health Insurance', '401k', 'Learning Budget'],
      postedBy: employerUsers[2]._id,
      status: 'Active',
      isFeatured: false,
      isRemote: false,
      easyApply: true,
      views: Math.floor(Math.random() * 1000) + 300,
      applications: Math.floor(Math.random() * 30) + 8,
      postedAt: randomDate(new Date(2024, 0, 1), new Date(2024, 5, 30))
    },
    {
      title: 'DevOps Engineer',
      company: 'CloudNine',
      companyId: companies[3]._id,
      companyLogo: companies[3].logo,
      description: 'Looking for a DevOps engineer to manage our cloud infrastructure.',
      requirements: ['3+ years DevOps experience', 'AWS or GCP certification', 'CI/CD expertise'],
      responsibilities: ['Manage cloud infrastructure', 'Implement CI/CD', 'Monitor systems'],
      salaryMin: 110000,
      salaryMax: 160000,
      salary: '$110k - $160k',
      location: 'Seattle, WA',
      lat: 47.6062,
      lng: -122.3321,
      jobType: 'Full-time',
      experienceLevel: 'Mid',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
      benefits: ['Health Insurance', 'Remote Work', 'Gym Membership'],
      postedBy: employerUsers[3]._id,
      status: 'Active',
      isFeatured: true,
      isRemote: true,
      easyApply: false,
      views: Math.floor(Math.random() * 1800) + 600,
      applications: Math.floor(Math.random() * 35) + 12,
      postedAt: randomDate(new Date(2024, 0, 1), new Date(2024, 5, 30))
    },
    {
      title: 'Frontend Developer',
      company: 'TechCorp',
      companyId: companies[0]._id,
      companyLogo: companies[0].logo,
      description: 'Join our frontend team to build responsive web applications.',
      requirements: ['2+ years React experience', 'CSS expertise', 'TypeScript knowledge'],
      responsibilities: ['Build React components', 'Optimize performance', 'Write tests'],
      salaryMin: 80000,
      salaryMax: 120000,
      salary: '$80k - $120k',
      location: 'San Francisco, CA',
      lat: 37.7749,
      lng: -122.4194,
      jobType: 'Full-time',
      experienceLevel: 'Mid',
      skills: ['React', 'TypeScript', 'CSS', 'Jest'],
      benefits: ['Health Insurance', '401k', 'Remote Work'],
      postedBy: employerUsers[0]._id,
      status: 'Active',
      isFeatured: false,
      isRemote: true,
      easyApply: true,
      views: Math.floor(Math.random() * 1200) + 350,
      applications: Math.floor(Math.random() * 45) + 20,
      postedAt: randomDate(new Date(2024, 0, 1), new Date(2024, 5, 30))
    },
    {
      title: 'Product Manager',
      company: 'StartupHub',
      companyId: companies[1]._id,
      companyLogo: companies[1].logo,
      description: 'Lead product development for our recruitment platform.',
      requirements: ['5+ years PM experience', 'Technical background preferred', 'Agile methodology'],
      responsibilities: ['Define product roadmap', 'Work with engineering', 'Analyze metrics'],
      salaryMin: 140000,
      salaryMax: 190000,
      salary: '$140k - $190k',
      location: 'Austin, TX',
      lat: 30.2672,
      lng: -97.7431,
      jobType: 'Full-time',
      experienceLevel: 'Senior',
      skills: ['Product Management', 'Agile', 'Data Analysis'],
      benefits: ['Health Insurance', 'Stock Options', 'Unlimited PTO'],
      postedBy: employerUsers[1]._id,
      status: 'Active',
      isFeatured: true,
      isRemote: false,
      easyApply: true,
      views: Math.floor(Math.random() * 900) + 200,
      applications: Math.floor(Math.random() * 25) + 10,
      postedAt: randomDate(new Date(2024, 0, 1), new Date(2024, 5, 30))
    },
    {
      title: 'Machine Learning Engineer',
      company: 'DataFlow Inc',
      companyId: companies[2]._id,
      companyLogo: companies[2].logo,
      description: 'Build and deploy machine learning models at scale.',
      requirements: ['4+ years ML experience', 'Python expert', 'Cloud platforms'],
      responsibilities: ['Develop ML models', 'Deploy to production', 'Optimize performance'],
      salaryMin: 150000,
      salaryMax: 220000,
      salary: '$150k - $220k',
      location: 'New York, NY',
      lat: 40.7128,
      lng: -74.0060,
      jobType: 'Full-time',
      experienceLevel: 'Senior',
      skills: ['Python', 'PyTorch', 'AWS', 'MLOps'],
      benefits: ['Health Insurance', '401k', 'Conference Budget'],
      postedBy: employerUsers[2]._id,
      status: 'Active',
      isFeatured: true,
      isRemote: true,
      easyApply: true,
      views: Math.floor(Math.random() * 1100) + 300,
      applications: Math.floor(Math.random() * 28) + 12,
      postedAt: randomDate(new Date(2024, 0, 1), new Date(2024, 5, 30))
    },
    {
      title: 'Backend Engineer',
      company: 'InnovateTech',
      companyId: companies[4]._id,
      companyLogo: companies[4].logo,
      description: 'Build scalable backend services for our platform.',
      requirements: ['3+ years backend experience', 'Java or Go expertise', 'Database design'],
      responsibilities: ['Design APIs', 'Optimize queries', 'Ensure scalability'],
      salaryMin: 100000,
      salaryMax: 150000,
      salary: '$100k - $150k',
      location: 'Boston, MA',
      lat: 42.3601,
      lng: -71.0589,
      jobType: 'Full-time',
      experienceLevel: 'Mid',
      skills: ['Java', 'Go', 'PostgreSQL', 'Redis'],
      benefits: ['Health Insurance', '401k', 'Flexible Hours'],
      postedBy: employerUsers[0]._id,
      status: 'Active',
      isFeatured: false,
      isRemote: true,
      easyApply: true,
      views: Math.floor(Math.random() * 800) + 150,
      applications: Math.floor(Math.random() * 32) + 8,
      postedAt: randomDate(new Date(2024, 0, 1), new Date(2024, 5, 30))
    }
  ];

  await Job.deleteMany({});
  const createdJobs = await Job.insertMany(jobs);
  console.log('Jobs seeded');
  return createdJobs;
};

const seedApplications = async (users, jobs) => {
  const jobSeekerUsers = users.filter(u => u.role === 'seeker');
  
  const applicationStatuses = ['Applied', 'Viewed', 'Shortlisted', 'Interview', 'Offer', 'Rejected'];
  
  const applications = [];
  
  // Create applications for each job seeker
  for (const user of jobSeekerUsers) {
    // Each job seeker applies to 3-6 random jobs
    const jobsToApply = randomItems(jobs, Math.floor(Math.random() * 4) + 3);
    
    for (const job of jobsToApply) {
      const appliedDate = randomDate(new Date(2024, 0, 1), new Date(2024, 5, 30));
      const status = applicationStatuses[Math.floor(Math.random() * applicationStatuses.length)];
      
      applications.push({
        jobId: job._id,
        userId: user._id,
        coverLetter: 'I am very interested in this position and believe my skills align well with the requirements.',
        status: status,
        timeline: [
          { status: 'Applied', note: 'Application submitted', date: appliedDate }
        ],
        appliedAt: appliedDate,
        updatedAt: randomDate(appliedDate, new Date(2024, 5, 30))
      });
    }
  }

  await Application.deleteMany({});
  const createdApplications = await Application.insertMany(applications);
  console.log('Applications seeded');
  return createdApplications;
};

const seedConversationsAndMessages = async (users, jobs) => {
  // Skip for now due to model mismatch
  console.log('Conversations and Messages seeding skipped');
  return { conversations: [], messages: [] };
  /*
  const jobSeekerUsers = users.filter(u => u.role === 'seeker');
  const employerUsers = users.filter(u => u.role === 'employer');
  
  const conversations = [];
  const messages = [];
  
  // Create conversations between job seekers and employers
  for (const jobSeeker of jobSeekerUsers) {
    // Each job seeker has 1-3 conversations with employers
    const numConversations = Math.floor(Math.random() * 3) + 1;
    const selectedEmployers = randomItems(employerUsers, numConversations);
    
    for (const employer of selectedEmployers) {
      const conversation = {
        participants: [jobSeeker._id, employer._id],
        jobId: job._id,
        lastMessageAt: randomDate(new Date(2024, 0, 1), new Date(2024, 5, 30)),
        createdAt: randomDate(new Date(2024, 0, 1), new Date(2024, 5, 30))
      };
      conversations.push(createdConv);
      
      // Add 2-5 messages per conversation
      const numMessages = Math.floor(Math.random() * 4) + 2;
      for (let i = 0; i < numMessages; i++) {
        const sender = i % 2 === 0 ? jobSeeker : employer;
        messages.push({
          conversationId: createdConv._id,
          sender: sender._id,
          content: i % 2 === 0 
            ? `Hi, I applied for the position and wanted to ask about the timeline.`
            : `Thank you for your interest! We'll review your application and get back to you soon.`,
          read: i < numMessages - 1,
          createdAt: randomDate(createdConv.createdAt, new Date(2024, 5, 30))
        });
      }
    }
  }

  await Conversation.deleteMany({});
  await Message.deleteMany({});
  
  await Conversation.insertMany(conversations);
  await Message.insertMany(messages);
  
  console.log('Conversations and Messages seeded');
  return { conversations, messages };
  */
};

const seedNotifications = async (users, jobs, applications) => {
  // Skip for now due to model mismatch
  console.log('Notifications seeding skipped');
  return [];
  /*
  const jobSeekerUsers = users.filter(u => u.role === 'seeker');
  const employerUsers = users.filter(u => u.role === 'employer');
  
  const notifications = [];
  
  // Notifications for job seekers
  for (const user of jobSeekerUsers) {
    // 2-5 notifications per job seeker
    const numNotifications = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < numNotifications; i++) {
      const job = randomItems(jobs, 1)[0];
      const notificationTypes = [
        { type: 'application_viewed', title: 'Your application was viewed', message: `Your application for ${job.title} was viewed by the employer.` },
        { type: 'application_shortlisted', title: 'You were shortlisted', message: `Congratulations! You've been shortlisted for ${job.title}.` },
        { type: 'new_message', title: 'New message', message: `You have a new message regarding ${job.title}.` },
        { type: 'job_match', title: 'New job matching your profile', message: `A new job matching your skills: ${job.title}` },
        { type: 'application_rejected', title: 'Application update', message: `Your application for ${job.title} was not selected.` }
      ];
      
      const notifType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      
      notifications.push({
        userId: user._id,
        type: notifType.type,
        title: notifType.title,
        message: notifType.message,
        link: `/jobs/${job._id}`,
        read: Math.random() > 0.5,
        createdAt: randomDate(new Date(2024, 0, 1), new Date(2024, 5, 30))
      });
    }
  }
  
  // Notifications for employers
  for (const user of employerUsers) {
    const numNotifications = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numNotifications; i++) {
      notifications.push({
        userId: user._id,
        type: 'new_application',
        title: 'New application received',
        message: 'You received a new application for one of your job postings.',
        link: '/employer/applicants',
        read: Math.random() > 0.5,
        createdAt: randomDate(new Date(2024, 0, 1), new Date(2024, 5, 30))
      });
    }
  }

  await Notification.deleteMany({});
  await Notification.insertMany(notifications);
  console.log('Notifications seeded');
  return notifications;
  */
};

const seedSavedJobs = async (users, jobs) => {
  // Skip for now
  console.log('Saved Jobs seeding skipped');
  return [];
};

const seedReviews = async (users, companies) => {
  // Skip for now
  console.log('Reviews seeding skipped');
  return [];
};

const seedAnalyticsData = async (jobs, applications) => {
  // Generate monthly analytics data for the last 6 months
  const monthlyAnalytics = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = month.toLocaleString('default', { month: 'short' });
    
    monthlyAnalytics.push({
      month: monthName,
      applications: Math.floor(Math.random() * 50) + 20,
      views: Math.floor(Math.random() * 2000) + 800,
      hires: Math.floor(Math.random() * 8) + 2,
      monthIndex: 5 - i
    });
  }
  
  console.log('Analytics data generated');
  return monthlyAnalytics;
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await mongoose.connection.dropDatabase();
    console.log('Database cleared');

    // Seed all data
    console.log('Seeding data...');
    const users = await seedUsers();
    const companies = await seedCompanies(users);
    const jobs = await seedJobs(users, companies);
    const applications = await seedApplications(users, jobs);
    const { conversations, messages } = await seedConversationsAndMessages(users, jobs);
    const notifications = await seedNotifications(users, jobs, applications);
    const savedJobs = await seedSavedJobs(users, jobs);
    const reviews = await seedReviews(users, companies);
    const analyticsData = await seedAnalyticsData(jobs, applications);

    console.log('========================================');
    console.log('Database seeded successfully!');
    console.log('========================================');
    console.log(`Users: ${users.length} (${users.filter(u => u.role === 'seeker').length} job seekers, ${users.filter(u => u.role === 'employer').length} employers)`);
    console.log(`Companies: ${companies.length}`);
    console.log(`Jobs: ${jobs.length}`);
    console.log(`Applications: ${applications.length}`);
    console.log(`Conversations: ${conversations.length}`);
    console.log(`Messages: ${messages.length}`);
    console.log(`Notifications: ${notifications.length}`);
    console.log(`Saved Jobs: ${savedJobs.length}`);
    console.log(`Reviews: ${reviews.length}`);
    console.log('========================================');
    
    console.log('\nTest Credentials:');
    console.log('Admin: admin@jobfinder.com / admin123');
    console.log('Job Seeker: john@example.com / password123');
    console.log('Employer: jane@example.com / password123');
    console.log('\nTo run seeder: cd backend && npm run seed');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
