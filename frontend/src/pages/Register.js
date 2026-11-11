import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
      <h2>Register for QuizMaster</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <input type="text" placeholder="Full Name" value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: 10, fontSize: 16 }} required />
        </div>
        <div style={{ marginBottom: 10 }}>
          <input type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: 10, fontSize: 16 }} required />
        </div>
        <div style={{ marginBottom: 10 }}>
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: 10, fontSize: 16 }} required />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10, background: '#2196F3', color: 'white', fontSize: 16, border: 'none', cursor: 'pointer' }}>
          Register
        </button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}