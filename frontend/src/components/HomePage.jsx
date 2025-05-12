import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // For demo, go directly to dashboard
    navigate('/dashboard');
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
        <button className="btn btn-link w-100 mt-2 text-decoration-none" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}

export default HomePage;