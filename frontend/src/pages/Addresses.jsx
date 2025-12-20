// src/pages/Addresses.jsx
import React, { useEffect, useState } from 'react';
import { fetchAddresses, createAddress, deleteAddress } from '../api/api'; // updateAddress if needed
import { useNavigate } from 'react-router-dom';

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form Data
  const [form, setForm] = useState({
      name: '', street: '', city: '', zip: '', mobile: '', is_default: false
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await fetchAddresses();
      setAddresses(data);
    } catch(err) {
       console.error(err);
    } finally {
       setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if(form.mobile.length !== 10) {
        alert("Mobile number must be exactly 10 digits.");
        return;
    }
    try {
       await createAddress(form);
       setShowForm(false);
       setForm({name:'', street:'', city:'', zip:'', mobile:'', is_default: false});
       load(); // reload list
    } catch(err) {
       const msg = err.response?.data?.errors?.[0] || "Failed to add address";
       alert(msg);
    }
  }

  async function remove(id) {
    if(!window.confirm("Are you sure?")) return;
    try {
       await deleteAddress(id);
       load();
    } catch(err) {
       alert("Failed to delete");
    }
  }

  if(loading) return <div style={{padding:40}}>Loading...</div>;

  return (
    <div style={{maxWidth:1000, margin:'40px auto', padding:20}}>
        <div style={{fontSize:14, marginBottom:20, color:'#565959'}}>
           <span style={{cursor:'pointer', textDecoration:'underline'}} onClick={() => navigate('/profile')}>Your Account</span> › Your Addresses
        </div>

        <h1 style={{fontSize:28, marginBottom:24}}>Your Addresses</h1>

        <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',
            gap:20
        }}>
            {/* Add Address Card */}
            <div 
              onClick={() => setShowForm(true)}
              style={{
                  border:'2px dashed #d5d9d9',
                  borderRadius:8,
                  display:'flex',
                  flexDirection:'column',
                  alignItems:'center',
                  justifyContent:'center',
                  height:260,
                  cursor:'pointer',
                  color:'#767676'
            }}>
                <div style={{fontSize:40, marginBottom:10}}>+</div>
                <div style={{fontSize:20, fontWeight:700}}>Add Address</div>
            </div>

            {/* List Addresses */}
            {addresses.map(addr => (
                <div key={addr.id} style={{
                    border: '1px solid #d5d9d9',
                    borderRadius:8,
                    padding:20,
                    height:260,
                    position:'relative',
                    background:'white'
                }}>
                    {addr.is_default && <span style={{fontSize:12, color:'#565959', borderBottom:'1px solid #565959'}}>Default</span>}
                    <div style={{fontWeight:700, marginTop:10}}>{addr.name}</div>
                    <div style={{marginTop:4}}>{addr.street}</div>
                    <div>{addr.city}, {addr.zip}</div>
                    <div>Phone number: {addr.mobile}</div>
                    
                    <div style={{position:'absolute', bottom:20, left:20, display:'flex', gap:10}}>
                       <button 
                         onClick={() => remove(addr.id)}
                         style={{color:'#007185', background:'none', border:'none', cursor:'pointer', padding:0}}
                        >
                           Remove
                       </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Modal-ish Form */}
        {showForm && (
            <div style={{
                position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center'
            }}>
                <div style={{background:'white', padding:30, borderRadius:8, width:500, maxWidth:'95%'}}>
                    <h3>Add a new address</h3>
                    <form onSubmit={handleAdd}>
                        <div style={{marginBottom:10}}><label style={{display:'block',fontWeight:700}}>Full Name</label><input required style={{width:'100%', padding:8}} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                        <div style={{marginBottom:10}}><label style={{display:'block',fontWeight:700}}>Address</label><input required style={{width:'100%', padding:8}} value={form.street} onChange={e=>setForm({...form,street:e.target.value})} /></div>
                        <div style={{marginBottom:10}}><label style={{display:'block',fontWeight:700}}>City</label><input required style={{width:'100%', padding:8}} value={form.city} onChange={e=>setForm({...form,city:e.target.value})} /></div>
                        <div style={{marginBottom:10}}><label style={{display:'block',fontWeight:700}}>Zip Code</label><input required style={{width:'100%', padding:8}} value={form.zip} onChange={e=>setForm({...form,zip:e.target.value})} /></div>
                    <div style={{marginBottom:10}}><label style={{display:'block',fontWeight:700}}>Phone Number</label>
                        <input 
                            required 
                            type="tel"
                            style={{width:'100%', padding:8}} 
                            value={form.mobile} 
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, '').slice(-10);
                                setForm({...form, mobile: val});
                            }} 
                        />
                    </div>
                    <div style={{marginBottom:20}}><label><input type="checkbox" checked={form.is_default} onChange={e=>setForm({...form, is_default:e.target.checked})} /> Set as default address</label></div>
                        
                    <div style={{display:'flex', gap:10}}>
                        <button style={{background:'#FFD814', border:'none', padding:'10px 20px', borderRadius:8}}>Add Address</button>
                        <button type="button" onClick={() => setShowForm(false)} style={{background:'white', border:'1px solid #ddd', padding:'10px 20px', borderRadius:8}}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )}
</div>
);
}
