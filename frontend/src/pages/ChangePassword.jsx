// src/pages/ChangePassword.jsx
import React, { useState } from 'react';
import { changePassword } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');

    try {
      const res = await changePassword(current, newPass);
      setMsg(res.message);
      setCurrent('');
      setNewPass('');
    } catch(err) {
      setError(err.response?.data?.error || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{maxWidth:600, margin:'40px auto', padding:20}}>
        <h2 style={{marginBottom:20}}>Change Password</h2>
        
        {msg && <div style={{padding:12, background:'#d1fae5', color:'#065f46', borderRadius:8, marginBottom:20}}>{msg}</div>}
        {error && <div style={{padding:12, background:'#fee2e2', color:'#991b1b', borderRadius:8, marginBottom:20}}>{error}</div>}

        <form onSubmit={handleSubmit} style={{background:'white', padding:24, borderRadius:12, border:'1px solid #eee'}}>
             <div style={{marginBottom:20}}>
                <label style={{display:'block', marginBottom:8, fontWeight:500}}>Current Password</label>
                <input 
                  type="password" 
                  value={current}
                  onChange={e => setCurrent(e.target.value)}
                  style={{width:'100%', padding:'10px', borderRadius:8, border:'1px solid #ddd'}}
                  required
                />
             </div>
             <div style={{marginBottom:24}}>
                <label style={{display:'block', marginBottom:8, fontWeight:500}}>New Password</label>
                <input 
                  type="password" 
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  style={{width:'100%', padding:'10px', borderRadius:8, border:'1px solid #ddd'}}
                  required
                  minLength={6}
                />
             </div>
             <button disabled={loading} style={{padding:'10px 20px', borderRadius:8, border:'none', background:'#111', color:'white', cursor:'pointer'}}>
                {loading ? 'Updating...' : 'Update Password'}
             </button>
        </form>
    </div>
  );
}
