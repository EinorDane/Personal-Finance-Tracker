// src/components/HomePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function HomePage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      // optional: call register API here
      localStorage.removeItem('token');
      await api.post('/api/auth/register', {
        username,
        email,
        password,
      });
      alert('Registration successful! Please log in.');
      setIsRegister(false);
    } else {
      // login API
      try {
        const response = await api.post('/api/auth/login', {
          username,
          password,
        });
        // Save token and redirect
        localStorage.setItem('token', response.data.jwt);
        navigate('/dashboard');
      } catch (err) {
        alert('Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card p-4 shadow-lg rounded-3" style={{ maxWidth: '400px', width: '100%', transition: 'transform 0.5s' }}>
        <h2 className="mb-4 text-center">{isRegister ? 'Create Account' : 'Sign In'}</h2>
        {isRegister && (
          <div className="mb-3">
            <input className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        )}
        <div className="mb-3">
          <input className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="mb-3">
          <input className="form-control" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary w-100" onClick={handleSubmit}>{isRegister ? 'Register' : 'Login'}</button>
        <button className="btn btn-link w-100 mt-2" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}

export default HomePage;