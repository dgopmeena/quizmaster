const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true }).select('-questions');
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createQuiz = async (req, res) => {
  try {
    const { title, description, category, difficulty, timeLimit, questions } = req.body;
    const quiz = await Quiz.create({ title, description, category, difficulty, timeLimit, createdBy: req.user.id });
    if (questions && questions.length > 0) {
      const createdQuestions = await Promise.all(questions.map(q => Question.create({ ...q, quizId: quiz._id })));
      quiz.questions = createdQuestions.map(q => q._id);
      await quiz.save();
    }
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    await Question.deleteMany({ quizId: req.params.id });
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllQuizzes, getQuizById, createQuiz, deleteQuiz };