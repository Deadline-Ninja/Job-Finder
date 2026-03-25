 import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true
  },
  logo: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  industry: {
    type: String,
    required: [true, 'Please provide industry']
  },
  location: {
    type: String,
    default: ''
  },
  lat: {
    type: Number,
    default: 0
  },
  lng: {
    type: Number,
    default: 0
  },
  website: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  employees: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500-1000', '1000+'],
    default: '1-10'
  },
  foundedYear: {
    type: Number
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500-1000', '1000+'],
    default: '1-10'
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  cultureImages: [{
    type: String
  }],
  benefits: [{
    type: String
  }],
  photos: [{
    type: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search
companySchema.index({ name: 'text', industry: 'text', description: 'text' });

const Company = mongoose.model('Company', companySchema);

export default Company;
