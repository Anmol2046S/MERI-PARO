const router = require('express').Router();
const resumeController = require('../controllers/resume.controller');
const { authenticate } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.use(authenticate);

router.post('/upload', upload.single('resume'), resumeController.upload);
router.get('/', resumeController.getAll);
router.get('/:id', resumeController.getById);
router.delete('/:id', resumeController.delete);
router.patch('/:id/primary', resumeController.setPrimary);

module.exports = router;
