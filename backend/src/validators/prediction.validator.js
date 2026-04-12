const { body } = require('express-validator');

const predictionValidation = [
  body('resumeId')
    .notEmpty().withMessage('Resume ID is required')
    .isInt({ min: 1 }).withMessage('Invalid resume ID'),
  body('modelType')
    .optional()
    .isIn(['baseline', 'ml', 'deep_learning']).withMessage('Invalid model type'),
];

const simulationValidation = [
  body('addedSkills')
    .isArray({ min: 1 }).withMessage('At least one skill is required')
    .bail()
    .custom((arr) => arr.every(s => typeof s === 'string' && s.trim().length > 0))
    .withMessage('Each skill must be a non-empty string'),
];

const jobDescriptionValidation = [
  body('title')
    .notEmpty().withMessage('Job title is required')
    .isLength({ min: 2, max: 300 }).withMessage('Title must be between 2 and 300 characters'),
  body('description')
    .notEmpty().withMessage('Job description is required')
    .isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
  body('company')
    .optional()
    .isLength({ max: 200 }).withMessage('Company name too long'),
];

module.exports = { predictionValidation, simulationValidation, jobDescriptionValidation };
