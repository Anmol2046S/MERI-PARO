const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.use(authorize('admin'));

router.get('/users', adminController.getUsers);
router.get('/analytics', adminController.getAnalytics);
router.patch('/users/:id/toggle-status', adminController.toggleUserStatus);

module.exports = router;
