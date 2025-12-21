// /home/lucifer/ecommerce/frontend/src/pages/Login.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login, signup, checkEmail } from '../api/api';
import "../styles/Auth.css";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState(initialMode);
  
  // Update mode if URL changes (e.g. clicking link while already on page)
  useEffect(() => {
    const m = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
    setMode(m);
  }, [searchParams]);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'password'
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
    // Only validate password if we are in signup mode OR in login mode step 2
    if ((mode === 'signup' || step === 'password') && password.length < 6) {
      return 'Password should be at least 6 characters.';
    }
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setInfoMsg('');

    // If Login Step 1: Validate Email Only
    if (mode === 'login' && step === 'email') {
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email.trim())) {
          setError('Please enter a valid email address.');
          return;
        }

        setLoading(true);
        try {
            const data = await checkEmail(email.trim());
            if (data.exists) {
                // Email found, proceed to password
                setStep('password');
            } else {
                // Email not found, redirect to signup
                setMode('signup');
                setInfoMsg("User not registered. Please create an account.");
                // We keep the email filled in
            }
        } catch (err) {
            console.error(err);
            setError('Error checking email. Please try again.');
        } finally {
            setLoading(false);
        }
        return;
    }

    // Normal Validation for Signup or Login Step 2
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
        
        {/* Left Side: Form */}
        <div className="auth-left animate-fade-in">
           <div className="auth-header">
              <h2 className="auth-title">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="auth-subtitle">
                {mode === 'login' ? 'Enter your details to sign in.' : 'Join us and start shopping today.'}
              </p>
           </div>

           <form onSubmit={handleSubmit} className="auth-form">
               {mode === 'signup' && (
                 <>
                   <div className="form-group animate-fade-in animate-delay-1">
                      <label className="form-label">Full Name</label>
                      <input 
                        className="form-input"
                        type="text" 
                        placeholder="John Doe"
                        value={name} onChange={e => setName(e.target.value)}
                      />
                   </div>
                   <div className="form-group animate-fade-in animate-delay-1">
                      <label className="form-label">Mobile</label>
                      <input 
                        className="form-input"
                        type="tel" 
                        placeholder="1234567890"
                        value={mobile} 
                        onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(-10))}
                      />
                   </div>
                 </>
               )}

               <div className="form-group animate-fade-in animate-delay-2">
                  <label className="form-label">Email Address</label>
                  <input 
                    className="form-input"
                    type="email" 
                    placeholder="you@company.com"
                    value={email} onChange={e => {
                        setEmail(e.target.value);
                        if(mode === 'login') setStep('email'); // Reset to step 1 if editing email
                    }}
                  />
               </div>

               {/* SHOW PASSWORD ONLY IF SIGNUP OR (LOGIN AND STEP IS PASSWORD) */}
               { (mode === 'signup' || (mode === 'login' && step === 'password')) && (
                   <div className="form-group animate-fade-in animate-delay-2">
                      <label className="form-label">Password</label>
                      <input 
                        className="form-input"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password} onChange={e => setPassword(e.target.value)}
                        autoFocus={mode === 'login'}
                      />
                   </div>
               )}

               {error && <div style={{color:'#ef4444', fontSize:14}}>{error}</div>}
               {infoMsg && <div style={{color:'#3b82f6', fontSize:14}}>{infoMsg}</div>}

               {(mode === 'signup' || (mode === 'login' && step === 'password')) && (
                   <button type="button" onClick={() => setShowPassword(!showPassword)} style={{fontSize:12, color:'#64748b', background:'none', border:'none', cursor:'pointer', textAlign:'right', marginTop:-10}}>
                      {showPassword ? 'Hide Password' : 'Show Password'}
                   </button>
               )}

               <button type="submit" className="auth-btn animate-fade-in animate-delay-3" disabled={loading}>
                  {loading ? 'Processing...' : (
                      mode === 'signup' ? 'Create Account' : (step === 'email' ? 'Continue' : 'Sign In')
                  )}
               </button>

               <div className="auth-footer animate-fade-in animate-delay-3">
                  {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    type="button" 
                    className="link-btn"
                    onClick={() => {
                       const newMode = mode === 'login' ? 'signup' : 'login';
                       setMode(newMode);
                       setError('');
                       setInfoMsg('');
                       setStep('email'); // Reset step
                    }}
                  >
                     {mode === 'login' ? 'Sign Up' : 'Log In'}
                  </button>
               </div>
           </form>
        </div>

        {/* Right Side: Illustration */}
        <div className="auth-right">
           {/* Abstract Glass Panels */}
           <div className="glass-panel-1"></div>
           <div className="glass-panel-2"></div>
           
           <div className="illustration-container">
              {/* Simple SVG Illustration of Shopping */}
              <svg width="300" height="300" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="250" cy="250" r="200" fill="white" fillOpacity="0.1"/>
                  <rect x="150" y="150" width="200" height="240" rx="20" fill="#4f46e5" fillOpacity="0.8" />
                  <rect x="170" y="170" width="160" height="120" rx="10" fill="white" fillOpacity="0.3" />
                  <circle cx="250" cy="420" r="20" fill="white" fillOpacity="0.5"/>
                  {/* Floating Elements */}
                  <rect x="100" y="100" width="80" height="80" rx="20" fill="#db2777" fillOpacity="0.8" className="animate-float" />
                  <circle cx="400" cy="180" r="40" fill="#fbbf24" fillOpacity="0.8" className="animate-float" style={{animationDelay:'1s'}} />
              </svg>
           </div>
           
           <div style={{marginTop:40, textAlign:'center', color:'white', position:'relative', zIndex:2}}>
              <h3 style={{fontSize:24, marginBottom:10}}>Shop Future</h3>
              <p style={{opacity:0.8, maxWidth:300}}>Experience the next generation of e-commerce with our premium selection.</p>
           </div>
        </div>

      </div>
    </div>
  );
}
