import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function QuizPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/quizzes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setQuiz(res.data);
      setTimeLeft(res.data.timeLimit * 60);
    });
  }, [id, token]);

  useEffect(() => {
    if (!timeLeft || submitted) return;
    if (timeLeft === 0) { handleSubmit(); return; }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, submitted]);

  const handleAnswer = (index) => {
    const newAnswers = [...answers];
    newAnswers[current] = { questionId: quiz.questions[current]._id, selectedAnswer: index };
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const timeTaken = quiz.timeLimit * 60 - timeLeft;
    const res = await axios.post('http://localhost:5000/api/attempts', {
      quizId: id, answers, timeTaken
    }, { headers: { Authorization: `Bearer ${token}` } });
    setResult(res.data);
  };

  if (!quiz) return <div style={{ padding: 40 }}>Loading...</div>;

  if (result) return (
    <div style={{ maxWidth: 600, margin: '100px auto', padding: 20, textAlign: 'center' }}>
      <h2>Quiz Complete!</h2>
      <h3>Score: {result.score} / {result.totalQuestions}</h3>
      <h3>{Math.round((result.score / result.totalQuestions) * 100)}%</h3>
      <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 16 }}>
        Go to Dashboard
      </button>
    </div>
  );

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const q = quiz.questions[current];

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2>{quiz.title}</h2>
        <div style={{ fontSize: 20, color: timeLeft < 60 ? 'red' : 'black' }}>
          ⏱ {mins}:{secs.toString().padStart(2, '0')}
        </div>
      </div>
      <p>Question {current + 1} of {quiz.questions.length}</p>
      <h3>{q.questionText}</h3>
      <div>
        {q.options.map((opt, i) => (
          <div key={i} onClick={() => handleAnswer(i)}
            style={{ padding: 15, margin: '10px 0', border: `2px solid ${answers[current]?.selectedAnswer === i ? '#4CAF50' : '#ddd'}`, borderRadius: 8, cursor: 'pointer', background: answers[current]?.selectedAnswer === i ? '#e8f5e9' : 'white' }}>
            {opt}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button onClick={() => setCurrent(c => c - 1)} disabled={current === 0}
          style={{ padding: '10px 20px', cursor: 'pointer' }}>Previous</button>
        {current < quiz.questions.length - 1 ? (
          <button onClick={() => setCurrent(c => c + 1)}
            style={{ padding: '10px 20px', background: '#2196F3', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Next</button>
        ) : (
          <button onClick={handleSubmit}
            style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Submit Quiz</button>
        )}
      </div>
    </div>
  );
}