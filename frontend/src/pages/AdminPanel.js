import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AdminPanel() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [timeLimit, setTimeLimit] = useState(10);
  const [questions, setQuestions] = useState([{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/quizzes')
      .then(res => setQuizzes(res.data));
  }, []);

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const updateQuestion = (i, field, value) => {
    const updated = [...questions];
    updated[i][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qi, oi, value) => {
    const updated = [...questions];
    updated[qi].options[oi] = value;
    setQuestions(updated);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/quizzes', {
        title, description, category, difficulty, timeLimit: Number(timeLimit), questions
      }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Quiz created successfully!');
      const res = await axios.get('http://localhost:5000/api/quizzes');
      setQuizzes(res.data);
      setTitle(''); setDescription(''); setCategory('');
      setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    } catch (err) {
      setMessage('Error creating quiz');
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/quizzes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setQuizzes(quizzes.filter(q => q._id !== id));
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Admin Panel</h1>
        <div>
          <Link to="/" style={{ marginRight: 15 }}>Home</Link>
          <button onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>
      </div>

      <h2>Create New Quiz</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleCreate}>
        <input placeholder="Quiz Title" value={title} onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10, fontSize: 16 }} required />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10, fontSize: 16 }} />
        <input placeholder="Category (e.g. Science)" value={category} onChange={e => setCategory(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10, fontSize: 16 }} required />
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
          style={{ padding: 10, marginBottom: 10, marginRight: 10, fontSize: 16 }}>
          <option>Easy</option><option>Medium</option><option>Hard</option>
        </select>
        <input type="number" placeholder="Time (minutes)" value={timeLimit} onChange={e => setTimeLimit(e.target.value)}
          style={{ padding: 10, marginBottom: 10, fontSize: 16, width: 150 }} />

        <h3>Questions</h3>
        {questions.map((q, qi) => (
          <div key={qi} style={{ border: '1px solid #ddd', padding: 15, marginBottom: 15, borderRadius: 8 }}>
            <input placeholder={`Question ${qi + 1}`} value={q.questionText}
              onChange={e => updateQuestion(qi, 'questionText', e.target.value)}
              style={{ width: '100%', padding: 8, marginBottom: 10, fontSize: 15 }} required />
            {q.options.map((opt, oi) => (
              <div key={oi} style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer === oi}
                  onChange={() => updateQuestion(qi, 'correctAnswer', oi)} style={{ marginRight: 8 }} />
                <input placeholder={`Option ${oi + 1}`} value={opt}
                  onChange={e => updateOption(qi, oi, e.target.value)}
                  style={{ flex: 1, padding: 8, fontSize: 14 }} required />
              </div>
            ))}
            <small style={{ color: '#666' }}>Select the radio button next to the correct answer</small>
          </div>
        ))}
        <button type="button" onClick={addQuestion}
          style={{ padding: '8px 16px', marginRight: 10, cursor: 'pointer' }}>+ Add Question</button>
        <button type="submit"
          style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Create Quiz
        </button>
      </form>

      <h2 style={{ marginTop: 40 }}>Existing Quizzes</h2>
      {quizzes.map(quiz => (
        <div key={quiz._id} style={{ display: 'flex', justifyContent: 'space-between', padding: 15, border: '1px solid #ddd', marginBottom: 10, borderRadius: 8 }}>
          <div><strong>{quiz.title}</strong> — {quiz.category} | {quiz.difficulty}</div>
          <button onClick={() => handleDelete(quiz._id)}
            style={{ padding: '5px 10px', background: 'red', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}