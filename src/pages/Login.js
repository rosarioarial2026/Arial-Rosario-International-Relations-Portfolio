// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      // Check if user is admin
      if (email.trim() !== 'rosarioarial2026@gmail.com') {
        await supabase.auth.signOut();
        throw new Error('Unauthorized. Admin access only.');
      }

      // Store session
      localStorage.setItem('isAdmin', 'true');
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-icon">
              <Lock size={32} />
            </div>
            <h1 className="login-title">Admin Login</h1>
            <p className="login-subtitle">Sign in to manage your portfolio</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={18} />
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rosarioarial2026@gmail.com"
                required
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock size={18} />
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="form-input"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p>Admin access only</p>
            <a href="/" className="back-link">← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
