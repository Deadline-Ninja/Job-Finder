import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'http://localhost:5000/api';

async function fetchAPI(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = text;
  }
  
  if (!res.ok) throw new Error(JSON.stringify(data, null, 2));
  return data;
}

async function runVerification() {
  console.log('--- Starting End-to-End Data Pipeline Verification ---');
  
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobfinder');
  console.log('✓ MongoDB Connected directly for verification.');

  let seekerToken, employerToken;
  let seekerId, employerId;
  let jobId;

  try {
    // 2. Register Employer
    console.log('\n[Action] Registering Job Employer through API...');
    const empRes = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Employer UI',
        email: `employer_${Date.now()}@example.com`,
        password: 'password123',
        role: 'employer'
      })
    });
    employerToken = empRes.token;
    employerId = empRes.user._id || empRes.user.id;
    console.log('✓ Employer registered successfully via API.');

    // 3. Register Seeker
    console.log('\n[Action] Registering Job Seeker through API...');
    const seekRes = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Seeker UI',
        email: `seeker_${Date.now()}@example.com`,
        password: 'password123',
        role: 'seeker'
      })
    });
    seekerToken = seekRes.token;
    seekerId = seekRes.user._id || seekRes.user.id;
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
    await fetchAPI('/users/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${seekerToken}` },
      body: JSON.stringify({
        skills: ['React', 'Node.js', 'Testing Pipeline'],
        experience: [],
        education: []
      })
    });
    console.log('✓ Profile updated via API.');

    // Verify in DB
    const dbUserUpdated = await mongoose.connection.collection('users').findOne({ _id: new mongoose.Types.ObjectId(seekerId) });
    if (dbUserUpdated && dbUserUpdated.skills && dbUserUpdated.skills.includes('Testing Pipeline')) {
      console.log('✓ VERIFIED IN DB: Profile skills properly updated in MongoDB.');
    } else {
      throw new Error('Skills not updated in DB!');
    }

    // 4.5 Create Company
    console.log('\n[Action] Employer creating a company through API...');
    const compRes = await fetchAPI('/companies', {
      method: 'POST',
      headers: { Authorization: `Bearer ${employerToken}` },
      body: JSON.stringify({
        name: 'Data Verify Corp',
        industry: 'Technology',
        location: 'Remote',
        description: 'Testing the data pipeline',
        size: '1-10'
      })
    });
    const companyId = compRes.company._id;
    console.log(`✓ Company created via API. Company ID: ${companyId}`);

    // 5. Post Job
    console.log('\n[Action] Employer posting a new job through API...');
    const jobRes = await fetchAPI('/jobs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${employerToken}` },
      body: JSON.stringify({
        title: 'Pipeline Test Engineer',
        company: 'Data Verify Corp',
        companyId: companyId,
        description: 'Testing the data pipeline',
        requirements: ['Node.js', 'MongoDB'],
        responsibilities: ['Writing test scripts'],
        location: 'Remote',
        jobType: 'Full-time',
        experienceLevel: 'Mid',
        skills: ['React'],
        benefits: ['Health']
      })
    });
    jobId = jobRes.job._id;
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
    await fetchAPI(`/saved-jobs`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${seekerToken}` },
      body: JSON.stringify({ jobId })
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

    // 7. Apply for Job (Seeker action)
    console.log('\n[Action] Seeker applying for the job through API...');
    await fetchAPI(`/applications`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${seekerToken}` },
      body: JSON.stringify({ 
        jobId,
        resume: 'https://example.com/resume.pdf',
        coverLetter: 'I am perfect for this testing role.'
      })
    });
    console.log('✓ Job Application submitted via API.');

    // Verify in DB
    const dbApp = await mongoose.connection.collection('applications').findOne({
      userId: new mongoose.Types.ObjectId(seekerId),
      jobId: new mongoose.Types.ObjectId(jobId)
    });
    if (dbApp) {
      console.log('✓ VERIFIED IN DB: Application document created in MongoDB pipeline.');
    } else {
      throw new Error('Application not found in DB!');
    }

    console.log('\n--- EVERYTHING WORKS: Pipeline Verification Passed Successfully! ---');

  } catch (err) {
    console.error('\n❌ Pipeline Verification Failed:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

runVerification();
