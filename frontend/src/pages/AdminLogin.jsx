// src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/api';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import '../styles/AdminLogin.css'; // We'll create this next

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      const data = await login(formData.email, formData.password);
      if (data.user?.admin) {
        // Successful Admin Login
        navigate('/admin');
      } else {
        // User logged in but NOT admin
        setServerError('Access Denied: You do not have admin privileges.');
      }
    } catch (err) {
      setServerError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2 className="login-title">Login to your account</h2>
        <p className="login-subtitle">Welcome back, please enter your details</p>

        {/* Social Buttons (Mock) */}
        <div className="social-login-row">
           <button className="social-btn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G" width="20" />
              Google
           </button>
           <button className="social-btn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="A" width="20" />
              Apple
           </button>
        </div>

        <div className="divider">Or</div>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="form-group">
             <label>Email Address <span className="req">*</span></label>
             <div className={`input-wrapper ${errors.email ? 'input-error' : ''}`}>
                <FiMail className="input-icon" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
             </div>
             {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          {/* Password Field */}
          <div className="form-group">
             <label>Password <span className="req">*</span></label>
             <div className={`input-wrapper ${errors.password ? 'input-error' : ''}`}>
                <FiLock className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                   {showPassword ? <FiEyeOff /> : <FiEye />}
                </div>
             </div>
             {errors.password && <div className="error-text">{errors.password}</div>}
          </div>

          {/* Options */}
          <div className="form-options">
             <label className="checkbox-label">
                <input type="checkbox" /> Stay logged in on this device
             </label>
             <span className="forgot-link">Forgot password?</span>
          </div>

          {serverError && <div className="server-error">{serverError}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
             {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div className="login-footer">
           Not registered yet? <span className="create-acc-link">Create an account</span>
        </div>
      </div>
    </div>
  );
}
