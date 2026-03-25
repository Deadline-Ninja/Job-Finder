import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const uploadDir = 'uploads';
const resumeDir = path.join(uploadDir, 'resumes');
const companyDir = path.join(uploadDir, 'companies');
const profileDir = path.join(uploadDir, 'profiles');

[uploadDir, resumeDir, companyDir, profileDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = uploadDir;
    if (file.fieldname === 'resume') {
      dest = resumeDir;
    } else if (file.fieldname === 'companyLogo') {
      dest = companyDir;
    } else if (file.fieldname === 'profilePhoto') {
      dest = profileDir;
    } else if (file.fieldname === 'cultureImages') {
      dest = companyDir;
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'resume': ['.pdf', '.doc', '.docx'],
    'companyLogo': ['.jpg', '.jpeg', '.png', '.webp'],
    'profilePhoto': ['.jpg', '.jpeg', '.png', '.webp'],
    'cultureImages': ['.jpg', '.jpeg', '.png', '.webp'],
    'default': ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx']
  };

  const field = file.fieldname || 'default';
  const allowed = allowedTypes[field] || allowedTypes['default'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowed.join(', ')}`), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Multi-file upload helper
export const uploadFields = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: fileFilter
}).fields([
  { name: 'resume', maxCount: 1 },
  { name: 'companyLogo', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'cultureImages', maxCount: 10 }
]);
