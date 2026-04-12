const router = require('express').Router();
const predictionController = require('../controllers/prediction.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { predictionValidation, simulationValidation, jobDescriptionValidation } = require('../validators/prediction.validator');
const { aiLimiter } = require('../middleware/rateLimiter');

router.use(authenticate);

router.post('/job-roles', aiLimiter, validate(predictionValidation), predictionController.predictJobRoles);
router.post('/skill-gap', aiLimiter, predictionController.getSkillGap);
router.post('/job-description', aiLimiter, validate(jobDescriptionValidation), predictionController.analyzeJobDescription);
router.post('/simulate', aiLimiter, validate(simulationValidation), predictionController.simulateCareer);
router.get('/', predictionController.getUserPredictions);
router.get('/job-roles', predictionController.getJobRoles);

module.exports = router;
