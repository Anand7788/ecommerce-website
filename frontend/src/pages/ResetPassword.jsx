// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if(password !== confirm) {
       setError("Passwords do not match");
       return;
    }
    setLoading(true);
    try {
       await resetPassword(token, password);
       alert("Password reset successfully! Please login.");
       navigate('/login');
    } catch(err) {
       setError(err.response?.data?.error?.join(', ') || "Failed to reset password.");
    } finally {
       setLoading(false);
    }
  }

  if(!token) return <div style={{padding:40, textAlign:'center'}}>Invalid Link</div>;

  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f3f4f6'}}>
       <div style={{background:'white', padding:40, borderRadius:16, width:'100%', maxWidth:400, boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}>
          <h2 style={{fontSize:24, fontWeight:700, marginBottom:24, color:'#111'}}>Reset Password</h2>
          
          {error && <div style={{padding:12, background:'#fee2e2', color:'#991b1b', borderRadius:8, marginBottom:20}}>{error}</div>}

          <form onSubmit={handleSubmit}>
             <div style={{marginBottom:16}}>
                <label style={{display:'block', marginBottom:8, fontSize:14}} >New Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid #d1d5db'}}
                  required
                  minLength={6}
                />
             </div>
             <div style={{marginBottom:24}}>
                <label style={{display:'block', marginBottom:8, fontSize:14}} >Confirm Password</label>
                <input 
                  type="password" 
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  style={{width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid #d1d5db'}}
                  required
                />
             </div>
             <button disabled={loading} style={{width:'100%', padding:12, borderRadius:8, border:'none', background:'#111', color:'white', fontSize:16, fontWeight:600, cursor:'pointer'}}>
                {loading ? 'Reseting...' : 'Reset Password'}
             </button>
          </form>
       </div>
    </div>
  );
}
