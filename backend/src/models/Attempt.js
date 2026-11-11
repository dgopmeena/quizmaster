const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{ questionId: mongoose.Schema.Types.ObjectId, selectedAnswer: Number }],
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number },
  timeTaken: { type: Number },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Attempt', attemptSchema);