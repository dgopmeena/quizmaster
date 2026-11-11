const express = require('express');
const router = express.Router();
const { getAllQuizzes, getQuizById, createQuiz, deleteQuiz } = require('../controllers/quizController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllQuizzes);
router.get('/:id', protect, getQuizById);
router.post('/', protect, adminOnly, createQuiz);
router.delete('/:id', protect, adminOnly, deleteQuiz);

module.exports = router;