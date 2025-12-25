// src/pages/Addresses.jsx
import React, { useEffect, useState } from 'react';
import { fetchAddresses, createAddress, deleteAddress } from '../api/api';
import { useNavigate } from 'react-router-dom';
import '../styles/Addresses.css';

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
    <div className="addresses-container">
        <div className="addresses-breadcrumb">
           <span onClick={() => navigate('/profile')}>Your Account</span> › Your Addresses
        </div>

        <h1 className="addresses-title">Your Addresses</h1>

        <div className="addresses-grid">
            {/* Add Address Card */}
            <div 
              className="add-address-card"
              onClick={() => setShowForm(true)}
            >
                <div className="add-icon">+</div>
                <div className="add-text">Add Address</div>
            </div>

            {/* List Addresses */}
            {addresses.map(addr => (
                <div key={addr.id} className="address-card">
                    {addr.is_default && <span className="default-badge">Default</span>}
                    <div className="address-name">{addr.name}</div>
                    <div className="address-line">{addr.street}</div>
                    <div className="address-line">{addr.city}, {addr.zip}</div>
                    <div className="address-line">Phone number: {addr.mobile}</div>
                    
                    <div className="address-actions">
                       <button 
                         className="btn-remove"
                         onClick={() => remove(addr.id)}
                        >
                           Remove
                       </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Modal-ish Form */}
        {showForm && (
            <div className="address-modal-overlay">
                <div className="address-modal-content">
                    <h3>Add a new address</h3>
                    <form onSubmit={handleAdd}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input required className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <input required className="form-input" value={form.street} onChange={e=>setForm({...form,street:e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">City</label>
                            <input required className="form-input" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Zip Code</label>
                            <input required className="form-input" value={form.zip} onChange={e=>setForm({...form,zip:e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input 
                                required 
                                type="tel"
                                className="form-input"
                                value={form.mobile} 
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '').slice(-10);
                                    setForm({...form, mobile: val});
                                }} 
                            />
                        </div>
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input type="checkbox" checked={form.is_default} onChange={e=>setForm({...form, is_default:e.target.checked})} /> 
                                Set as default address
                            </label>
                        </div>
                        
                        <div className="modal-actions">
                            <button className="btn-submit-address">Add Address</button>
                            <button type="button" onClick={() => setShowForm(false)} className="btn-cancel-address">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}
