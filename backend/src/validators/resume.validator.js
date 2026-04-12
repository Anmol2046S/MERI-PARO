const { body, param } = require('express-validator');

const resumeIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid resume ID is required')
];

const jobDescriptionValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ max: 300 })
    .withMessage('Title must be less than 300 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ min: 50, max: 10000 })
    .withMessage('Description must be between 50 and 10000 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Company name must be less than 200 characters')
];

module.exports = { resumeIdValidation, jobDescriptionValidation };
