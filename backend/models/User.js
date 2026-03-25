import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['seeker', 'employer', 'admin'],
    default: 'seeker'
  },
  isKYCVerified: {
    type: Boolean,
    default: false
  },
  preferredJobType: {
    type: String,
    default: ''
  },
  mobileNumber: {
    type: String,
    default: ''
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  experience: [{
    company: String,
    title: String,
    years: Number,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  education: [{
    school: String,
    degree: String,
    field: String,
    year: Number
  }],
  resume: {
    type: String,
    default: ''
  },
  portfolio: [{
    type: String
  }],
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  bio: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search
userSchema.index({ name: 'text', skills: 'text' });

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
