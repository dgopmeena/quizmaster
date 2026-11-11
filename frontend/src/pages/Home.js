import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://quizmaster-o36d.onrender.com/api/quizzes')
      .then(res => setQuizzes(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1>🧠 QuizMaster</h1>
        <div>
          {user ? (
            <>
              <Link to="/dashboard" style={{ marginRight: 15 }}>Dashboard</Link>
              {user.role === 'admin' && <Link to="/admin" style={{ marginRight: 15 }}>Admin</Link>}
              <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: 15 }}>Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>

      <h2>Available Quizzes</h2>
      {quizzes.length === 0 ? (
        <p>No quizzes available yet. {user?.role === 'admin' && <Link to="/admin">Add quizzes from Admin Panel</Link>}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
          {quizzes.map(quiz => (
            <div key={quiz._id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
              <h3>{quiz.title}</h3>
              <p>{quiz.description}</p>
              <p>Category: {quiz.category} | Difficulty: {quiz.difficulty}</p>
              <p>Time: {quiz.timeLimit} minutes</p>
              {user ? (
                <Link to={`/quiz/${quiz._id}`}>
                  <button style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                    Start Quiz
                  </button>
                </Link>
              ) : (
                <Link to="/login">
                  <button style={{ padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                    Login to Start
                  </button>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
