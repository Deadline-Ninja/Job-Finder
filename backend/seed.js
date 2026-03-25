import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Company from './models/Company.js';
import Job from './models/Job.js';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobfinder_premium');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const industries = [
    'Technology', 'Finance', 'Healthcare', 'Design', 'Marketing', 
    'Education', 'Real Estate', 'Logistics', 'Retail', 'Automotive'
];

const locations = [
    'San Francisco, CA', 'New York, NY', 'London, UK', 'Berlin, Germany', 'Singapore',
    'Tokyo, Japan', 'Austin, TX', 'Toronto, Canada', 'Sydney, Australia', 'Dubai, UAE'
];

const companyData = [
    { name: 'TechFlow Systems', industry: 'Technology', desc: 'Leading the future of cloud computing and AI.' },
    { name: 'Global Finance Partners', industry: 'Finance', desc: 'Secure and innovative financial solutions forEveryone.' },
    { name: 'HealthPulse', industry: 'Healthcare', desc: 'Revolutionizing patient care through digital health.' },
    { name: 'Creative Wave', industry: 'Design', desc: 'Award-winning design studio shaping modern brands.' },
    { name: 'MarketReach', industry: 'Marketing', desc: 'Data-driven marketing strategies for global reach.' },
    { name: 'EduLearn Pro', industry: 'Education', desc: 'Empowering students with next-gen learning platforms.' },
    { name: 'Skyline Estates', industry: 'Real Estate', desc: 'Connecting people with their dream homes and investments.' },
    { name: 'LogiLink', industry: 'Logistics', desc: 'Efficient global logistics and supply chain management.' },
    { name: 'Moda Retail', industry: 'Retail', desc: 'The future of sustainable fashion and retail experience.' },
    { name: 'AutoVision', industry: 'Automotive', desc: 'Developing the next generation of electric and autonomous vehicles.' }
];

const jobTitles = [
    'Senior Software Engineer', 'Frontend Developer', 'UX/UI Designer', 'Product Manager', 
    'Data Scientist', 'Marketing Coordinator', 'Content Strategist', 'Customer Success Manager',
    'Project Coordinator', 'Sales Executive', 'HR Specialist', 'Legal Counsel',
    'Operations Manager', 'Cloud Architect', 'DevOps Engineer', 'Security Specialist'
];

const companyImages = [
    'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop'
];

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('Clearing existing data...');
        await Job.deleteMany();
        await Company.deleteMany();
        // Keep seekers, only clear employers created by seed previously if possible, 
        // but for simplicity let's just create new ones or clear all employers.
        await User.deleteMany({ role: 'employer' });

        console.log('Seeding Employers and Companies...');
        const employers = [];
        const companies = [];

        for (let i = 0; i < 10; i++) {
            const employer = await User.create({
                name: `${companyData[i].name} Admin`,
                email: `admin@${companyData[i].name.toLowerCase().replace(/\s/g, '')}.com`,
                password: 'password123',
                role: 'employer',
                profilePhoto: companyImages[i],
                location: locations[i],
                bio: `Hiring manager at ${companyData[i].name}.`
            });
            employers.push(employer);

            const company = await Company.create({
                name: companyData[i].name,
                industry: companyData[i].industry,
                description: companyData[i].desc,
                logo: companyImages[i],
                coverImage: `https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&h=400&fit=crop&q=80`,
                location: locations[i],
                website: `https://www.${companyData[i].name.toLowerCase().replace(/\s/g, '')}.com`,
                size: '51-200',
                owner: employer._id,
                isVerified: true
            });
            companies.push(company);

            // Update employer with companyId
            employer.companyId = company._id;
            await employer.save();

            console.log(`Created Company: ${company.name}`);

            // Create 10 jobs for each company
            console.log(`Seeding 10 jobs for ${company.name}...`);
            for (let j = 0; j < 10; j++) {
                const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
                await Job.create({
                    title: `${title} - ${company.name}`,
                    company: company.name,
                    companyId: company._id,
                    companyLogo: company.logo,
                    description: `Join ${company.name} as a ${title}. ${company.description} We are looking for talented individuals to join our growing team.`,
                    requirements: ['3+ years of experience', 'Strong communication skills', 'Bachelor degree in related field'],
                    responsibilities: ['Develop new features', 'Collaborate with team members', 'Maintain code quality'],
                    salaryMin: 80000 + Math.floor(Math.random() * 40000),
                    salaryMax: 130000 + Math.floor(Math.random() * 50000),
                    salary: `$80k - $150k`,
                    location: company.location,
                    jobType: ['Full-time', 'Remote', 'Contract'][Math.floor(Math.random() * 3)],
                    experienceLevel: ['Entry', 'Mid', 'Senior', 'Lead'][Math.floor(Math.random() * 4)],
                    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'CSS'],
                    postedBy: employer._id,
                    status: 'Active',
                    views: Math.floor(Math.random() * 500),
                    applications: Math.floor(Math.random() * 50),
                    isFeatured: j < 2, // First 2 jobs are featured
                    isRemote: Math.random() > 0.5,
                    easyApply: true,
                    postedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000)
                });
            }
        }

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error seeding data: ${error.message}`);
        process.exit(1);
    }
};

seedData();
