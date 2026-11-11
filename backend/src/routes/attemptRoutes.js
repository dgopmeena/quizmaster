const express = require('express');
const router = express.Router();
const { submitAttempt, getUserAttempts, getAllAttempts } = require('../controllers/attemptController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, submitAttempt);
router.get('/my', protect, getUserAttempts);
router.get('/all', protect, adminOnly, getAllAttempts);

module.exports = router;