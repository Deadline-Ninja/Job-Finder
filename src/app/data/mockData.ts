export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  branch?: 'Kathmandu' | 'Pokhara' | 'Lalitpur' | 'Bharatpur' | 'Biratnagar' | 'Butwal';
  type: 'Remote' | 'Hybrid' | 'Onsite' | 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salary: string; 
  postedDate: string;
  description: string;
  requirements: string[];
  benefits: string[];
  latitude: number;
  longitude: number;
  isVerified?: boolean;
  saved?: boolean;
  applied?: boolean;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  location: string;
  branch: 'Kathmandu' | 'Pokhara' | 'Lalitpur' | 'Bharatpur' | 'Biratnagar' | 'Butwal';
  description: string;
  website: string;
  openPositions: number;
  isVerified?: boolean;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  companyName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  appliedDate: string;
  candidateName: string;
  status: 'pending' | 'reviewing' | 'interview' | 'rejected' | 'accepted' | 'shortlisted';
}

export interface Notification {
  id: string;
  type: 'application' | 'message' | 'alert' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'F1Soft International',
    companyLogo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=200&h=200&fit=crop',
    location: 'Hattisar, Kathmandu',
    branch: 'Kathmandu',
    type: 'Full-time',
    salary: 'NPR 150k - NPR 200k',
    postedDate: '2 days ago',
    latitude: 27.7172,
    longitude: 85.3240,
    isVerified: true,
    description: 'We are looking for a Senior Software Engineer to lead our fintech platform development. You will work on cutting-edge financial technology products used by millions of Nepali users.',
    requirements: ['5+ years of Java/Spring experience', 'Microservices architecture', 'Leadership skills', 'Knowledge of REST APIs'],
    benefits: ['Health insurance', 'Paid leave', 'Festival bonus', 'Remote work options'],
    saved: true
  },
  {
    id: '2',
    title: 'Digital Marketing Manager',
    company: 'Daraz Nepal',
    companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop',
    location: 'Naxal, Kathmandu',
    branch: 'Kathmandu',
    type: 'Full-time',
    salary: 'NPR 80k - NPR 120k',
    postedDate: '1 week ago',
    latitude: 27.7120,
    longitude: 85.3300,
    isVerified: true,
    description: 'Join Nepal\'s leading e-commerce platform to lead digital marketing strategies and drive growth across the country.',
    requirements: ['3+ years in digital marketing', 'SEO/SEM expertise', 'Analytics proficiency', 'Social media management'],
    benefits: ['Employee discounts', 'Training', 'Transport allowance', 'Medical insurance'],
    applied: true
  },
  {
    id: '3',
    title: 'Hotel Operations Manager',
    company: 'Fish Tail Lodge',
    companyLogo: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200&h=200&fit=crop',
    location: 'Lakeside, Pokhara',
    branch: 'Pokhara',
    type: 'Full-time',
    salary: 'NPR 60k - NPR 90k',
    postedDate: '3 days ago',
    latitude: 28.2096,
    longitude: 83.9856,
    isVerified: true,
    description: 'Manage daily operations of our iconic lakeside hotel in Pokhara. Ensure excellent guest experience and coordinate with all departments.',
    requirements: ['5+ years hotel management experience', 'Fluent English', 'Leadership skills', 'Tourism industry knowledge'],
    benefits: ['Accommodation provided', 'Meals included', 'Annual leave', 'Health insurance'],
  },
  {
    id: '4',
    title: 'Tourism Guide & Coordinator',
    company: 'Himalayan Trekking Co.',
    companyLogo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop',
    location: 'Pokhara',
    branch: 'Pokhara',
    type: 'Contract',
    salary: 'NPR 40k - NPR 65k',
    postedDate: '5 days ago',
    latitude: 28.2380,
    longitude: 83.9956,
    isVerified: false,
    description: 'Lead trekking and tour groups around the Annapurna region. Share Nepal\'s culture and nature with international visitors.',
    requirements: ['Trekking guide license', 'English proficiency', 'Physical fitness', 'First aid certification'],
    benefits: ['Seasonal bonus', 'Equipment provided', 'Travel allowances'],
  },
  {
    id: '5',
    title: 'Wildlife Safari Guide',
    company: 'Chitwan Jungle Lodge',
    companyLogo: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=200&h=200&fit=crop',
    location: 'Sauraha, Chitwan',
    branch: 'Bharatpur',
    type: 'Full-time',
    salary: 'NPR 45k - NPR 70k',
    postedDate: '2 days ago',
    latitude: 27.5791,
    longitude: 84.4915,
    isVerified: true,
    description: 'Lead wildlife safaris and nature walks inside Chitwan National Park. Educate guests about conservation and local ecology.',
    requirements: ['Wildlife guide certification', 'Knowledge of local flora & fauna', 'English communication', 'Driving license'],
    benefits: ['Accommodation', 'Meals', 'Seasonal bonus', 'Uniform provided'],
  },
  {
    id: '6',
    title: 'Agricultural Field Officer',
    company: 'AgroNepal Ltd.',
    companyLogo: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=200&h=200&fit=crop',
    location: 'Bharatpur, Chitwan',
    branch: 'Bharatpur',
    type: 'Full-time',
    salary: 'NPR 35k - NPR 55k',
    postedDate: '4 days ago',
    latitude: 27.6833,
    longitude: 84.4333,
    isVerified: false,
    description: 'Oversee agricultural projects in the Terai region. Work with farmers to introduce modern farming techniques and improve crop yields.',
    requirements: ['B.Sc. Agriculture or similar', 'Field work experience', 'Nepali & basic English', 'Motorbike license'],
    benefits: ['Vehicle allowance', 'Field allowance', 'Health insurance', 'Annual bonus'],
  },
  {
    id: '7',
    title: 'Branch Manager – Banking',
    company: 'Prabhu Bank',
    companyLogo: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=200&h=200&fit=crop',
    location: 'Adarshanagar, Birgunj',
    branch: 'Bharatpur',
    type: 'Full-time',
    salary: 'NPR 90k - NPR 130k',
    postedDate: '1 day ago',
    latitude: 27.0104,
    longitude: 84.8779,
    isVerified: true,
    description: 'Lead the Birgunj branch of Prabhu Bank. Manage a team of 20+, drive deposits, loans, and customer satisfaction targets.',
    requirements: ['MBA or Finance degree', '7+ years banking experience', 'Management skills', 'NRB regulations knowledge'],
    benefits: ['Provident fund', 'Gratuity', 'Medical insurance', 'Festival allowance'],
  },
  {
    id: '8',
    title: 'Logistics Coordinator',
    company: 'Nepal Trading Corp.',
    companyLogo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=200&fit=crop',
    location: 'Birgunj, Province 2',
    branch: 'Bharatpur',
    type: 'Full-time',
    salary: 'NPR 40k - NPR 60k',
    postedDate: '6 days ago',
    latitude: 27.0104,
    longitude: 84.8779,
    isVerified: false,
    description: 'Coordinate cross-border logistics between India and Nepal. Manage customs documentation, shipment tracking, and warehouse operations.',
    requirements: ['2+ years logistics experience', 'Customs clearance knowledge', 'Hindi and Nepali proficiency', 'MS Office skills'],
    benefits: ['Transport allowance', 'Overtime pay', 'Dashain bonus'],
  },
  {
    id: '9',
    title: 'Hospital Administrator',
    company: 'Bheri Zonal Hospital',
    companyLogo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&h=200&fit=crop',
    location: 'Nepalgunj, Banke',
    branch: 'Kathmandu',
    type: 'Full-time',
    salary: 'NPR 55k - NPR 85k',
    postedDate: '3 days ago',
    latitude: 28.0500,
    longitude: 81.6167,
    isVerified: true,
    description: 'Oversee operations and administration of this zonal hospital serving the Midwest region of Nepal.',
    requirements: ['MHA or MBA in Health Management', '5+ years hospital admin', 'Leadership skills', 'Budgeting experience'],
    benefits: ['Government grade pay', 'Retirement fund', 'Housing allowance', 'Medical facilities'],
  },
  {
    id: '10',
    title: 'Software Developer – React',
    company: 'Yomari Tech',
    companyLogo: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=200&h=200&fit=crop',
    location: 'Sukedhara, Bhaktapur',
    branch: 'Kathmandu',
    type: 'Full-time',
    salary: 'NPR 70k - NPR 110k',
    postedDate: '1 day ago',
    latitude: 27.6710,
    longitude: 85.4298,
    isVerified: true,
    description: 'Build modern web applications using React and TypeScript at our Bhaktapur tech startup. Join a growing team of passionate developers.',
    requirements: ['3+ years React/TypeScript', 'REST API integration', 'Git proficiency', 'Agile methodology'],
    benefits: ['Flexible hours', 'Remote options', 'Stock options', 'Learning budget'],
  },
  {
    id: '11',
    title: 'UI/UX Designer',
    company: 'PixelCraft Studio',
    companyLogo: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=200&fit=crop',
    location: 'Pulchowk, Lalitpur',
    branch: 'Lalitpur',
    type: 'Full-time',
    salary: 'NPR 60k - NPR 95k',
    postedDate: '4 days ago',
    latitude: 27.6780,
    longitude: 85.3179,
    isVerified: true,
    description: 'Design beautiful, user-centered digital products for clients across Nepal and internationally. Work closely with our engineering team in Lalitpur.',
    requirements: ['Figma/Adobe XD expertise', '3+ years UX design', 'Portfolio required', 'User research skills'],
    benefits: ['Creative environment', 'Health insurance', 'Flexible schedule', 'Annual retreats'],
  },
  {
    id: '12',
    title: 'High School Teacher – Science',
    company: 'Budhanilkantha School',
    companyLogo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&h=200&fit=crop',
    location: 'Tulsipur, Dang',
    branch: 'Kathmandu',
    type: 'Full-time',
    salary: 'NPR 30k - NPR 50k',
    postedDate: '5 days ago',
    latitude: 28.1500,
    longitude: 82.2833,
    isVerified: false,
    description: 'Teach science subjects (Physics, Chemistry, Biology) to grades 9-12. Join a school committed to rural education excellence in Dang district.',
    requirements: ['B.Ed. or M.Sc. in Science', 'Teaching license', 'Patience and dedication', 'Residential preference'],
    benefits: ['Accommodation', 'Meals', 'School fee waiver for children', 'Annual leave'],
  },
  {
    id: '13',
    title: 'Tea Estate Field Supervisor',
    company: 'Ilam Tea Estates Pvt.',
    companyLogo: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&h=200&fit=crop',
    location: 'Ilam Bazaar, Ilam',
    branch: 'Biratnagar',
    type: 'Full-time',
    salary: 'NPR 35k - NPR 55k',
    postedDate: '2 days ago',
    latitude: 26.9115,
    longitude: 87.9233,
    isVerified: true,
    description: 'Supervise tea cultivation, plucking schedules, and processing quality at our renowned Ilam estate. Ensure premium quality standards.',
    requirements: ['Agriculture background preferred', '2+ years tea/farming experience', 'Physical fitness', 'Team leadership'],
    benefits: ['Accommodation', 'Meals', 'Annual bonus', 'Transport to district HQ'],
  },
  {
    id: '14',
    title: 'Trekking Route Manager',
    company: 'Annapurna Adventure',
    companyLogo: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=200&h=200&fit=crop',
    location: 'Jomsom, Mustang',
    branch: 'Pokhara',
    type: 'Contract',
    salary: 'NPR 50k - NPR 80k',
    postedDate: '7 days ago',
    latitude: 28.7792,
    longitude: 83.7286,
    isVerified: false,
    description: 'Manage trekking routes in Upper Mustang. Coordinate with local teahouses, ensure route safety, and lead premium trekking groups.',
    requirements: ['Trekking experience in Mustang', 'Guide license', 'English & basic Tibetan preferred', 'First aid certified'],
    benefits: ['Seasonal contract', 'Accommodation', 'Equipment provided', 'High-altitude bonus'],
  },
  {
    id: '15',
    title: 'Civil Engineer – Road Projects',
    company: 'Nepal Infrastructure Dev.',
    companyLogo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=200&fit=crop',
    location: 'Lalitpur, Bagmati',
    branch: 'Lalitpur',
    type: 'Full-time',
    salary: 'NPR 80k - NPR 130k',
    postedDate: '3 days ago',
    latitude: 27.6644,
    longitude: 85.3188,
    isVerified: true,
    description: 'Lead civil engineering projects including road, bridge, and drainage construction across Nepal. Report to project directors.',
    requirements: ['B.E. Civil Engineering', 'NEC registration', '4+ years field experience', 'AutoCAD proficiency'],
    benefits: ['Vehicle allowance', 'Project bonus', 'Health insurance', 'Provident fund'],
  },
  {
    id: '16',
    title: 'Accountant',
    company: 'Himalayan Distillery',
    companyLogo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop',
    location: 'Birtamod, Jhapa',
    branch: 'Biratnagar',
    type: 'Full-time',
    salary: 'NPR 40k - NPR 65k',
    postedDate: '4 days ago',
    latitude: 26.6487,
    longitude: 87.9997,
    isVerified: false,
    description: 'Manage day-to-day accounting, payroll, and tax filing for a leading beverage company in the eastern Terai region.',
    requirements: ['B.Com or CA Inter', '3+ years accounting experience', 'Tally/Excel expertise', 'Tax regulations knowledge'],
    benefits: ['Provident fund', 'Festival bonus', 'Gratuity', 'Health insurance'],
  },
];

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'F1Soft International',
    logo: 'https://ui-avatars.com/api/?name=F1&background=0D8ABC&color=fff&size=200&font-size=0.5',
    industry: 'FinTech',
    size: '500-1000',
    location: 'Hattisar, Kathmandu',
    branch: 'Kathmandu',
    description: 'F1Soft is the leading FinTech company in Nepal, powering most digital banking services.',
    website: 'https://f1soft.com',
    openPositions: 15,
    isVerified: true
  },
  {
    id: '2',
    name: 'Daraz Nepal',
    logo: 'https://ui-avatars.com/api/?name=DN&background=FF6A00&color=fff&size=200&font-size=0.5',
    industry: 'E-commerce',
    size: '1000-5000',
    location: 'Naxal, Kathmandu',
    branch: 'Kathmandu',
    description: 'Daraz is Nepal\'s leading online marketplace, connecting thousands of sellers and buyers.',
    website: 'https://daraz.com.np',
    openPositions: 24,
    isVerified: true
  },
  {
    id: '3',
    name: 'WorldLink Communications',
    logo: 'https://ui-avatars.com/api/?name=WL&background=004A99&color=fff&size=200&font-size=0.5',
    industry: 'ISP / Telecommunications',
    size: '5000+',
    location: 'Jawalakhel, Lalitpur',
    branch: 'Lalitpur',
    description: 'WorldLink is the largest private ISP in Nepal, providing internet services nationwide.',
    website: 'https://worldlink.com.np',
    openPositions: 42,
    isVerified: true
  },
  {
    id: '4',
    name: 'Ncell Axiata',
    logo: 'https://ui-avatars.com/api/?name=NC&background=660099&color=fff&size=200&font-size=0.5',
    industry: 'Telecommunications',
    size: '1000-5000',
    location: 'Lainchaur, Kathmandu',
    branch: 'Kathmandu',
    description: 'Ncell is a leading GSM mobile operator in Nepal, providing high-quality communication services.',
    website: 'https://ncell.axiata.com',
    openPositions: 18,
    isVerified: true
  },
  {
    id: '5',
    name: 'Nepal Telecom',
    logo: 'https://ui-avatars.com/api/?name=NT&background=0033A0&color=fff&size=200&font-size=0.5',
    industry: 'Telecommunications',
    size: '5000+',
    location: 'Bhadrakali, Kathmandu',
    branch: 'Kathmandu',
    description: 'Nepal Telecom (NTC) is the state-owned telecommunication service provider in Nepal.',
    website: 'https://ntc.net.np',
    openPositions: 56,
    isVerified: true
  },
  {
    id: '6',
    name: 'Pathao Nepal',
    logo: 'https://ui-avatars.com/api/?name=PN&background=E52421&color=fff&size=200&font-size=0.5',
    industry: 'Ride-sharing / Delivery',
    size: '200-500',
    location: 'Mid-Baneshwor, Kathmandu',
    branch: 'Kathmandu',
    description: 'Pathao is the most popular ride-sharing and food delivery platform in Nepal.',
    website: 'https://pathao.com/np',
    openPositions: 12,
    isVerified: true
  },
  {
    id: '7',
    name: 'eSewa',
    logo: 'https://ui-avatars.com/api/?name=eS&background=4CAF50&color=fff&size=200&font-size=0.5',
    industry: 'FinTech',
    size: '500-1000',
    location: 'Pulchowk, Lalitpur',
    branch: 'Lalitpur',
    description: 'eSewa is Nepal\'s first and leading digital wallet and payment gateway.',
    website: 'https://esewa.com.np',
    openPositions: 21,
    isVerified: true
  },
  {
    id: '8',
    name: 'Khalti Digital Wallet',
    logo: 'https://ui-avatars.com/api/?name=KH&background=5C2D91&color=fff&size=200&font-size=0.5',
    industry: 'FinTech',
    size: '200-500',
    location: 'Baneshwor, Kathmandu',
    branch: 'Kathmandu',
    description: 'Khalti is an emerging digital payment provider in Nepal with a focus on ease of use.',
    website: 'https://khalti.com',
    openPositions: 9,
    isVerified: true
  }
];



export const mockPosts: Post[] = [
  {
    id: '1',
    authorName: 'Sagar Sharma',
    authorTitle: 'Senior Developer at CloudFactory',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    content: 'Excited to announce that we are expanding our engineering team in Kathmandu! We are looking for React and Node.js enthusiasts. DM me if interested! #Hiring #KathmanduJobs #CloudFactory',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
    likes: 124,
    comments: 18,
    timestamp: '2h'
  },
  {
    id: '2',
    authorName: 'Anjali Rai',
    authorTitle: 'HR Manager at Daraz',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    content: 'Namaste everyone! We just concluded our annual tech summit at Daraz. Great energy and amazing ideas for the future of e-commerce in Nepal. #TechSummit #DarazLife',
    likes: 89,
    comments: 5,
    timestamp: '5h'
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    userName: 'Roshan Thapa',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    companyName: 'F1Soft International',
    rating: 5,
    comment: 'Great work culture and amazing learning opportunities in FinTech.',
    date: 'Jan 2024'
  }
];

export const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    jobTitle: 'Senior Software Engineer',
    company: 'F1Soft International',
    companyLogo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=200&h=200&fit=crop',
    appliedDate: '2024-03-08',
    candidateName: 'John Doe',
    status: 'reviewing',
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 's1',
    senderName: 'Sagar Sharma',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    text: 'Namaste! I would like to inquire about the React Developer role.',
    timestamp: '10:30 AM',
    isRead: false
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'application',
    title: 'Update on application',
    message: 'Your application for Digital Marketing Manager at Daraz has been reviewed.',
    timestamp: '1 day ago',
    isRead: false
  }
];
