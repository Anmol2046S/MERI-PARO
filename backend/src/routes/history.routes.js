const router = require('express').Router();
const historyController = require('../controllers/history.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', historyController.getHistory);
router.get('/timeline', historyController.getTimeline);

module.exports = router;
