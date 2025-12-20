// /home/lucifer/ecommerce/frontend/src/pages/Login.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../api/api';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function validate() {
    if (mode === 'signup' && !name.trim()) {
      return 'Please enter your name.';
    }
    if (mode === 'signup' && (!mobile || mobile.length !== 10)) {
        return 'Please enter a valid 10-digit mobile number.';
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (password.length < 6) {
      return 'Password should be at least 6 characters.';
    }
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await login(email.trim(), password);
        
        // Welcome Back logic (simple alert for now or toast)
        // Check if user has name
        const userName = res.user.name || "User";
        localStorage.setItem('user_name', userName); // Store for profile display
        
        // We use a small timeout to let the navigation happen or just alert before
        // Ideally use a Toast library, but for now simple alert as requested "message"
        alert(`Welcome back, ${userName}!`);

        // notify other parts of app (Navbar) that auth changed
        window.dispatchEvent(new Event('authChange'));

        navigate('/');
      } else {
        await signup({
          name: name.trim(),
          email: email.trim(),
          mobile,
          password,
          password_confirmation: password,
        });

        window.dispatchEvent(new Event('authChange'));

        navigate('/');
      }
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleClick() {
    alert('Google login UI is ready. OAuth integration can be added later.');
  }

  useEffect(() => {
    // Add class when login page is mounted to style background
    document.body.classList.add('auth-body');
    return () => {
      // Remove when leaving login page
      document.body.classList.remove('auth-body');
    };
  }, []);


  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Left gradient welcome section */}
        <div className="auth-hero">
          <div className="auth-pill" />
          <h1>Welcome to Shopperspoint</h1>
          <p>
            Discover mobiles, accessories and more. Create an account or sign in
            to continue your shopping experience.
          </p>
          <ul className="auth-list">
            <li>Fast checkout & saved carts</li>
            <li>Track your orders in real time</li>
            <li>Secure payments (Stripe ready)</li>
          </ul>
        </div>

        {/* Right login / signup panel */}
        <div className="auth-panel">
          <div className="auth-panel-inner">
            <div className="auth-toggle">
              <button
                type="button"
                className={mode === 'login' ? 'auth-toggle-btn active' : 'auth-toggle-btn'}
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
              >
                Login
              </button>
              <button
                type="button"
                className={mode === 'signup' ? 'auth-toggle-btn active' : 'auth-toggle-btn'}
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
              >
                Sign up
              </button>
            </div>

            <h2 className="auth-title">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="auth-subtitle">
              {mode === 'login'
                ? 'Sign in to continue shopping.'
                : 'It only takes a minute to join us.'}
            </p>

            {/* Google button */}
            <button type="button" className="auth-google-btn" onClick={handleGoogleClick}>
              <span className="auth-google-icon">G</span>
              Continue with Google
            </button>

            <div className="auth-divider">
              <span>or use your email</span>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {mode === 'signup' && (
                <>
                  <div className="auth-field">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div className="auth-field">
                    <label>Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="10 digit mobile number"
                      value={mobile}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').slice(-10);
                        setMobile(val);
                      }}
                    />
                  </div>
                </>
              )}

              <div className="auth-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="auth-field">
                <label>Password</label>
                <div className="auth-password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword(v => !v)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {mode === 'login' && (
                <div className="auth-meta-row">
                  <label className="auth-remember">
                    <input type="checkbox" defaultChecked /> <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="auth-link"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {error && <div className="auth-error">{error}</div>}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Sign up'}
              </button>

              {mode === 'login' ? (
                <p className="auth-footer-text">
                  New here?{' '}
                  <button
                    type="button"
                    className="auth-link"
                    onClick={() => {
                      setMode('signup');
                      setError('');
                    }}
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p className="auth-footer-text">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="auth-link"
                    onClick={() => {
                      setMode('login');
                      setError('');
                    }}
                  >
                    Login instead
                  </button>
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
