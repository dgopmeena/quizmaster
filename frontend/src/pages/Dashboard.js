import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [attempts, setAttempts] = useState([]);
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://quizmaster-o36d.onrender.com/api/attempts/my', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setAttempts(res.data))
      .catch(err => console.log(err));
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1>Dashboard</h1>
        <div>
          <Link to="/" style={{ marginRight: 15 }}>Home</Link>
          <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      <h2>Welcome, {user?.name}!</h2>

      <h3>Your Quiz Attempts</h3>
      {attempts.length === 0 ? (
        <p>No attempts yet. <Link to="/">Take a quiz!</Link></p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f2f2f2' }}>
              <th style={{ padding: 10, border: '1px solid #ddd' }}>Quiz</th>
              <th style={{ padding: 10, border: '1px solid #ddd' }}>Score</th>
              <th style={{ padding: 10, border: '1px solid #ddd' }}>Total</th>
              <th style={{ padding: 10, border: '1px solid #ddd' }}>Percentage</th>
              <th style={{ padding: 10, border: '1px solid #ddd' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map(attempt => (
              <tr key={attempt._id}>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>{attempt.quizId?.title}</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>{attempt.score}</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>{attempt.totalQuestions}</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>{Math.round((attempt.score / attempt.totalQuestions) * 100)}%</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>{new Date(attempt.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
