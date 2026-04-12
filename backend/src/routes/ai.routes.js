const router = require('express').Router();
const aiController = require('../controllers/ai.controller');
const { authenticate } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

router.use(authenticate);

router.post('/recommendations/generate', aiLimiter, aiController.getRecommendations);
router.get('/recommendations', aiController.getUserRecommendations);
router.patch('/recommendations/:id/complete', aiController.markComplete);
router.get('/dashboard', aiController.getDashboard);

module.exports = router;
