const express = require('express');
const router = express.Router();
const geminiController = require('../controllers/gemini.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate); // Protect all gemini routes

router.post('/generate', geminiController.generateInsights);

module.exports = router;
