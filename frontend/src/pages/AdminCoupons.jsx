import React, { useEffect, useState } from 'react';
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from '../api/api';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
      code: '',
      discount_type: 'percent',
      discount_value: '',
      min_order_amount: 0,
      active: true
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  async function loadCoupons() {
    try {
        const data = await fetchCoupons();
        setCoupons(data);
    } catch(e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  }

  function openCreate() {
      setEditingId(null);
      setForm({ code: '', discount_type: 'percent', discount_value: '', min_order_amount: 0, active: true });
      setShowModal(true);
  }

  function openEdit(coupon) {
      setEditingId(coupon.id);
      setForm({
          code: coupon.code,
          discount_type: coupon.discount_type,
          discount_value: coupon.discount_value,
          min_order_amount: coupon.min_order_amount,
          active: coupon.active
      });
      setShowModal(true);
  }

  async function handleSubmit(e) {
      e.preventDefault();
      try {
          if (editingId) {
              await updateCoupon(editingId, form);
              alert("Coupon Updated!");
          } else {
              await createCoupon(form);
              alert("Coupon Created!");
          }
          setShowModal(false);
          loadCoupons();
      } catch(err) {
          alert("Failed to save coupon: " + (err.response?.data?.error || err.message));
      }
  }

  async function handleDelete(id) {
      if(!window.confirm("Delete this coupon?")) return;
      try {
          await deleteCoupon(id);
          loadCoupons();
      } catch(e) {
          alert("Failed to delete");
      }
  }

  if(loading) return <div style={{padding:40}}>Loading...</div>;

  return (
    <div className="admin-page">
       <div className="admin-header">
         <div className="admin-title">
             <h2>Coupons</h2>
             <p>Manage discount codes</p>
         </div>
         <button className="admin-create-btn" onClick={openCreate}>+ Create Coupon</button>
       </div>

       <div className="chart-card">
         <div className="desktop-table-container">
           <table style={{width:'100%', borderCollapse:'collapse'}}>
               <thead>
                   <tr style={{textAlign:'left', borderBottom:'1px solid #eee', color:'#666'}}>
                       <th style={{padding:12}}>Code</th>
                       <th style={{padding:12}}>Discount</th>
                       <th style={{padding:12}}>Min Order</th>
                       <th style={{padding:12}}>Status</th>
                       <th style={{padding:12}}>Actions</th>
                   </tr>
               </thead>
               <tbody>
                   {coupons.map(c => (
                       <tr key={c.id} style={{borderBottom:'1px solid #f9fafb'}}>
                           <td style={{padding:12, fontWeight:600}}>{c.code}</td>
                           <td style={{padding:12}}>
                               {c.discount_type === 'percent' ? `${c.discount_value}%` : `₹${c.discount_value}`}
                           </td>
                           <td style={{padding:12}}>₹{c.min_order_amount}</td>
                           <td style={{padding:12}}>
                               <span style={{
                                   padding:'2px 8px', borderRadius:99, fontSize:12, fontWeight:600,
                                   background: c.active ? '#dzfce7' : '#fee2e2',
                                   color: c.active ? '#166534' : '#991b1b'
                               }}>
                                   {c.active ? 'Active' : 'Inactive'}
                               </span>
                           </td>
                           <td style={{padding:12}}>
                               <button onClick={() => openEdit(c)} style={{color:'#4f46e5', background:'none', border:'none', cursor:'pointer', marginRight:12, fontWeight:600}}>Edit</button>
                               <button onClick={() => handleDelete(c.id)} style={{color:'#ef4444', background:'none', border:'none', cursor:'pointer'}}>Delete</button>
                           </td>
                       </tr>
                   ))}
                   {coupons.length === 0 && <tr><td colSpan="5" style={{padding:20, textAlign:'center'}}>No coupons found</td></tr>}
               </tbody>
           </table>
         </div>

         <div className="mobile-list">
             {coupons.map(c => (
                 <div key={c.id} className="mobile-card">
                     <div className="mobile-card-row" style={{borderBottom:'1px solid #eee', paddingBottom:8, marginBottom:12, alignItems:'center'}}>
                         <span style={{fontWeight:600, fontSize:16, color:'#4f46e5'}}>{c.code}</span>
                         <span style={{
                              padding:'2px 8px', borderRadius:99, fontSize:11, fontWeight:600,
                              background: c.active ? '#dzfce7' : '#fee2e2',
                              color: c.active ? '#166534' : '#991b1b'
                          }}>
                              {c.active ? 'Active' : 'Inactive'}
                          </span>
                     </div>
                     <div className="mobile-card-row">
                         <span className="mobile-card-label">Discount</span>
                         <span className="mobile-card-value">{c.discount_type === 'percent' ? `${c.discount_value}%` : `₹${c.discount_value}`}</span>
                     </div>
                     <div className="mobile-card-row">
                         <span className="mobile-card-label">Min. Order</span>
                         <span className="mobile-card-value">₹{c.min_order_amount}</span>
                     </div>
                     
                     <div style={{marginTop:12, paddingTop:12, borderTop:'1px solid #fafa', display:'flex', justifyContent:'flex-end', gap:10}}>
                        <button onClick={() => openEdit(c)} style={{color:'#4f46e5', background:'none', border:'none', cursor:'pointer', fontWeight:600, fontSize:14}}>Edit</button>
                        <button onClick={() => handleDelete(c.id)} style={{color:'#ef4444', background:'none', border:'none', cursor:'pointer', fontWeight:600, fontSize:14}}>Delete</button>
                     </div>
                 </div>
             ))}
             {coupons.length === 0 && <div style={{padding:20, textAlign:'center', color:'#999'}}>No coupons found</div>}
         </div>
       </div>

       {showModal && (
           <div className="modal-overlay">
               <div className="modal-content">
                   <div className="modal-header">
                       <h3>{editingId ? "Edit Coupon" : "Create New Coupon"}</h3>
                       <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                   </div>
                   <div className="modal-body">
                       <form onSubmit={handleSubmit}>
                           <div className="form-group">
                               <label className="form-label">Coupon Code</label>
                               <input 
                                   className="form-input"
                                   value={form.code} 
                                   onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} 
                                   required 
                                   placeholder="e.g. SAVE20" 
                               />
                           </div>
                           <div className="form-row" style={{display:'flex', gap:16}}>
                               <div className="form-group" style={{flex:1}}>
                                   <label className="form-label">Type</label>
                                   <select 
                                       className="form-select"
                                       value={form.discount_type} 
                                       onChange={e => setForm({...form, discount_type: e.target.value})}
                                   >
                                       <option value="percent">Percentage (%)</option>
                                       <option value="fixed">Fixed Amount (₹)</option>
                                   </select>
                               </div>
                               <div className="form-group" style={{flex:1}}>
                                   <label className="form-label">Value</label>
                                   <input 
                                       type="number" 
                                       className="form-input"
                                       value={form.discount_value} 
                                       onChange={e => setForm({...form, discount_value: e.target.value})} 
                                       required 
                                       placeholder="10"
                                   />
                               </div>
                           </div>
                           <div className="form-group">
                               <label className="form-label">Minimum Order Amount (₹)</label>
                               <input 
                                   type="number" 
                                   className="form-input"
                                   value={form.min_order_amount} 
                                   onChange={e => setForm({...form, min_order_amount: e.target.value})} 
                                   placeholder="0"
                               />
                           </div>
                           <div className="form-group" style={{display:'flex', alignItems:'center', gap:10, marginTop:10}}>
                               <input 
                                   type="checkbox"
                                   checked={form.active}
                                   onChange={e => setForm({...form, active: e.target.checked})}
                                   id="activeCheck"
                               />
                               <label htmlFor="activeCheck" style={{fontSize:14, fontWeight:500, color:'#374151'}}>Active Status</label>
                           </div>
                           <div style={{marginTop:24, display:'flex', justifyContent:'flex-end'}}>
                               <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                               <button type="submit" className="btn-save">{editingId ? "Update Coupon" : "Create Coupon"}</button>
                           </div>
                       </form>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
}
