const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const API_URL = 'http://localhost:5000/api';

async function runVerification() {
  console.log('--- Starting End-to-End Data Pipeline Verification ---');
  
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobfinder', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✓ MongoDB Connected directly for verification.');

  let seekerToken, employerToken;
  let seekerId, employerId;
  let jobId;

  try {
    // 2. Register Employer
    console.log('\n[Action] Registering Job Employer through API...');
    const empRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test Employer UI',
      email: `employer_${Date.now()}@example.com`,
      password: 'password123',
      role: 'employer'
    });
    employerToken = empRes.data.token;
    employerId = empRes.data.user._id;
    console.log('✓ Employer registered successfully via API.');

    // 3. Register Seeker
    console.log('\n[Action] Registering Job Seeker through API...');
    const seekRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test Seeker UI',
      email: `seeker_${Date.now()}@example.com`,
      password: 'password123',
      role: 'seeker'
    });
    seekerToken = seekRes.data.token;
    seekerId = seekRes.data.user._id;
    
    // Check if seekRes.data.user._id exists or use user.id
    seekerId = seekRes.data.user._id || seekRes.data.user.id;
    console.log('✓ Job Seeker registered successfully via API.');

    // Verify in DB
    const dbUser = await mongoose.connection.collection('users').findOne({ _id: new mongoose.Types.ObjectId(seekerId) });
    if (dbUser) {
      console.log('✓ VERIFIED IN DB: Seeker user correctly saved to MongoDB.');
    } else {
      throw new Error('User not found in DB!');
    }

    // 4. Update Profile
    console.log('\n[Action] Seeker updating profile skills through API...');
    await axios.put(`${API_URL}/users/profile`, {
      skills: ['React', 'Node.js', 'Testing Pipeline'],
      experience: [],
      education: []
    }, {
      headers: { Authorization: `Bearer ${seekerToken}` }
    });
    console.log('✓ Profile updated via API.');

    // Verify in DB
    const dbUserUpdated = await mongoose.connection.collection('users').findOne({ _id: new mongoose.Types.ObjectId(seekerId) });
    if (dbUserUpdated && dbUserUpdated.skills && dbUserUpdated.skills.includes('Testing Pipeline')) {
      console.log('✓ VERIFIED IN DB: Profile skills properly updated in MongoDB.');
    } else {
      throw new Error('Skills not updated in DB!');
    }

    // 5. Post Job
    console.log('\n[Action] Employer posting a new job through API...');
    const jobRes = await axios.post(`${API_URL}/jobs`, {
      title: 'Pipeline Test Engineer',
      company: 'Data Verify Corp',
      description: 'Testing the data pipeline',
      requirements: ['Node.js', 'MongoDB'],
      responsibilities: ['Writing test scripts'],
      location: 'Remote',
      jobType: 'Full-time',
      experienceLevel: 'Mid',
      skills: ['React'],
      benefits: ['Health']
    }, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    jobId = jobRes.data.job._id;
    console.log(`✓ Job posted via API. Job ID: ${jobId}`);

    // Verify in DB
    const dbJob = await mongoose.connection.collection('jobs').findOne({ _id: new mongoose.Types.ObjectId(jobId) });
    if (dbJob && dbJob.title === 'Pipeline Test Engineer') {
      console.log('✓ VERIFIED IN DB: Job explicitly saved to MongoDB pipeline.');
    } else {
      throw new Error('Job not found in DB!');
    }

    // 6. Save Job (Seeker action)
    console.log('\n[Action] Seeker saving the job through API...');
    await axios.post(`${API_URL}/saved-jobs/${jobId}`, {}, {
      headers: { Authorization: `Bearer ${seekerToken}` }
    });
    console.log('✓ Job saved via API.');

    // Verify in DB
    const dbSavedJob = await mongoose.connection.collection('savedjobs').findOne({
      userId: new mongoose.Types.ObjectId(seekerId),
      jobId: new mongoose.Types.ObjectId(jobId)
    });
    if (dbSavedJob) {
      console.log('✓ VERIFIED IN DB: SavedJob document created in MongoDB pipeline.');
    } else {
      throw new Error('Saved job not found in DB!');
    }

    console.log('\n--- EVERYTHING WORKS: Pipeline Verification Passed Successfully! ---');

  } catch (err) {
    console.error('\n❌ Pipeline Verification Failed:', err.response?.data || err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

runVerification();
