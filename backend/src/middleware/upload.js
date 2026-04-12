const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { env } = require('../config/env');
const ApiError = require('../utils/ApiError');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', env.UPLOAD_DIR));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Allowed MIME types and their corresponding extensions
const ALLOWED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt']
};

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ALLOWED_TYPES[file.mimetype];

  if (allowedExts && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only PDF, Word (.doc/.docx), and plain text (.txt) documents are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
    files: 1
  }
});

module.exports = { upload };
