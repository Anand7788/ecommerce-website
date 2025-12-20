// src/pages/LoginSecurity.jsx
import React, { useEffect, useState } from 'react';
import { fetchProfile, updateProfile } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function LoginSecurity() {
  const [user, setUser] = useState({ name: '', email: '', mobile: '' });
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null); // 'name', 'email', 'mobile' or null
  const [tempValue, setTempValue] = useState('');
  const [msg, setMsg] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await fetchProfile();
      setUser(data);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(field) {
    setEditingField(field);
    setTempValue(user[field] || '');
    setMsg('');
  }

  function cancelEdit() {
    setEditingField(null);
    setMsg('');
  }

  async function saveEdit() {
    if(!tempValue.trim()) return alert("Value cannot be empty");
    
    if(editingField === 'mobile') {
        const clean = tempValue.replace(/\D/g, '');
        if(clean.length !== 10) return alert("Mobile number must be exactly 10 digits.");
    }
    
    try {
      const payload = { [editingField]: tempValue };
      const res = await updateProfile(payload);
      setUser(res.user);
      
      // Update local storage if name changed
      if(editingField === 'name') {
         localStorage.setItem('user_name', res.user.name);
      }
      
      setEditingField(null);
      setMsg(`${editingField} updated successfully.`);
    } catch(err) {
      alert("Failed to update.");
    }
  }

  if(loading) return <div style={{padding:40}}>Loading...</div>;

  const Row = ({ label, value, field, type="text" }) => (
    <div style={{
       marginBottom: 0, 
       padding: '20px 0', 
       borderBottom:'1px solid #e7e7e7',
       display:'flex',
       justifyContent:'space-between',
       alignItems:'center'
    }}>
      <div style={{flex:1}}>
         <div style={{fontWeight:600, marginBottom:4}}>{label}</div>
         {editingField === field ? (
             <div style={{display:'flex', gap:10, alignItems:'center'}}>
                <input 
                  type={type} 
                  value={tempValue} 
                  onChange={e => {
                      if(editingField === 'mobile') {
                          setTempValue(e.target.value.replace(/\D/g, '').slice(-10));
                      } else {
                          setTempValue(e.target.value);
                      }
                  }}
                  style={{padding:'6px 10px', borderRadius:4, border:'1px solid #ccc'}}
                />
                <button onClick={saveEdit} style={{background:'#FFD814', border:'none', padding:'6px 12px', borderRadius:8, cursor:'pointer'}}>Save</button>
                <button onClick={cancelEdit} style={{background:'white', border:'1px solid #ddd', padding:'6px 12px', borderRadius:8, cursor:'pointer'}}>Cancel</button>
             </div>
         ) : (
             <div style={{color:'#111'}}>{value || `Add ${label}`}</div>
         )}
      </div>
      {editingField !== field && (
         <button 
           onClick={() => startEdit(field)}
           style={{
             border:'1px solid #D5D9D9', 
             background:'white', 
             padding:'6px 20px', 
             borderRadius:8, 
             cursor:'pointer',
             boxShadow:'0 2px 5px rgba(213,217,217,.5)'
           }}
         >
           Edit
         </button>
      )}
    </div>
  );

  return (
    <div style={{maxWidth:600, margin:'40px auto', padding:20}}>
        {/* Breadcrumb */}
        <div style={{fontSize:14, marginBottom:20, color:'#565959'}}>
           <span style={{cursor:'pointer', textDecoration:'underline'}} onClick={() => navigate('/profile')}>Your Account</span> › Login & Security
        </div>

        <h1 style={{fontSize:28, marginBottom:24}}>Login & Security</h1>
        
        {msg && <div style={{padding:10, background:'#d1fae5', color:'#065f46', borderRadius:4, marginBottom:10}}>{msg}</div>}

        <div style={{border:'1px solid #D5D9D9', borderRadius:8, padding:'0 20px'}}>
           <Row label="Name" value={user.name} field="name" />
           <Row label="Email" value={user.email} field="email" type="email" />
           <Row label="Mobile Phone Number" value={user.mobile} field="mobile" type="tel" />
           
           {/* Password Row is special */}
           <div style={{
               padding: '20px 0', 
               display:'flex',
               justifyContent:'space-between',
               alignItems:'center'
            }}>
              <div>
                 <div style={{fontWeight:600, marginBottom:4}}>Password</div>
                 <div style={{color:'#111'}}>********</div>
              </div>
              <button 
                onClick={() => navigate('/change-password')}
                style={{
                    border:'1px solid #D5D9D9', 
                    background:'white', 
                    padding:'6px 20px', 
                    borderRadius:8, 
                    cursor:'pointer',
                    boxShadow:'0 2px 5px rgba(213,217,217,.5)'
                }}
                >
                Edit
                </button>
            </div>
        </div>

        <div style={{marginTop:20, fontSize:13, color:'#565959'}}>
           Done with edits? <span style={{color:'#007185', cursor:'pointer'}} onClick={() => navigate('/profile')}>Return to Profile</span>
        </div>
    </div>
  );
}
