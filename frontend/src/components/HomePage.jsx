import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // reference to your api.js

function HomePage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      // Registration API
      try {
        await api.post('/api/auth/register', {
          username,
          email,
          password,
        });
        alert('Registration successful! Please log in.');
        setIsRegister(false);
      } catch (err) {
        alert('Registration failed');
        console.error(err);
      }
    } else {
      // Login API
      try {
        const response = await api.post('/api/auth/login', {
          username,
          password,
        });
        // Save token and navigate
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } catch (err) {
        alert('Login failed');
        console.error(err);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        {isRegister && (
          <div>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <button
        className="btn btn-link"
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
      </button>
    </div>
  );
}

export default HomePage;