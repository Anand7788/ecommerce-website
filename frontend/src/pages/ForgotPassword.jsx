// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { sendPasswordReset } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if(!email) return;
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await sendPasswordReset(email);
      setMessage(res.message || 'If an account exists, a link has been sent.');
      
      // FOR DEV: Show the mock token if returned (security risk in prod, but needed for user to test)
      if(res.db_token_mock) {
         console.log("Mock Token:", res.db_token_mock);
         // Auto redirect for demo ease?
         // NO, let user see the "Check console" message or similar. 
         // Integrating into message for user visibility as per user persona helper
         setMessage(`(DEV MODE) Link Sent! Reset Token: ${res.db_token_mock}. \nCheck valid URL structure in console.`);
      }

    } catch(err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f3f4f6'}}>
       <div style={{background:'white', padding:40, borderRadius:16, width:'100%', maxWidth:400, boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}>
          <h2 style={{fontSize:24, fontWeight:700, marginBottom:10, color:'#111'}}>Forgot Password?</h2>
          <p style={{color:'#666', marginBottom:24}}>Enter your email to receive a reset link.</p>
          
          {message && <div style={{padding:12, background:'#d1fae5', color:'#065f46', borderRadius:8, marginBottom:20, whiteSpace:'pre-wrap'}}>{message}</div>}
          {error && <div style={{padding:12, background:'#fee2e2', color:'#991b1b', borderRadius:8, marginBottom:20}}>{error}</div>}

          <form onSubmit={handleSubmit}>
             <div style={{marginBottom:20}}>
                <label style={{display:'block', marginBottom:8, fontSize:14, fontWeight:500, color:'#374151'}}>Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid #d1d5db', fontSize:16}}
                  placeholder="you@example.com"
                  required
                />
             </div>
             <button disabled={loading} style={{width:'100%', padding:12, borderRadius:8, border:'none', background:'#111', color:'white', fontSize:16, fontWeight:600, cursor:'pointer', opacity: loading ? 0.7 : 1}}>
                {loading ? 'Sending...' : 'Send Reset Link'}
             </button>
          </form>
          
          <button onClick={() => navigate('/login')} style={{marginTop:20, width:'100%', background:'none', border:'none', color:'#666', cursor:'pointer'}}>
             Back to Login
          </button>
       </div>
    </div>
  );
}
