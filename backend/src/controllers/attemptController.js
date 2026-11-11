const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

const submitAttempt = async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    const questions = await Question.find({ quizId });
    
    let score = 0;
    answers.forEach(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      if (question && question.correctAnswer === answer.selectedAnswer) {
        score++;
      }
    });

    const attempt = await Attempt.create({
      userId: req.user.id,
      quizId,
      answers,
      score,
      totalQuestions: questions.length,
      timeTaken,
      completed: true
    });

    res.status(201).json({ attempt, score, totalQuestions: questions.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.id }).populate('quizId', 'title category');
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find().populate('userId', 'name email').populate('quizId', 'title');
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitAttempt, getUserAttempts, getAllAttempts };