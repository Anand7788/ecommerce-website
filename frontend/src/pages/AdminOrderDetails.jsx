// src/pages/AdminOrderDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAdminOrder, updateOrderStatus } from '../api/api';
import { FiBox, FiUser, FiMapPin, FiArrowLeft, FiTruck } from 'react-icons/fi';

export default function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function loadOrder() {
    try {
      const data = await fetchAdminOrder(id);
      setOrder(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load order");
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      setOrder(prev => ({ ...prev, status: newStatus }));
      alert("Status updated!");
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if(loading) return <div style={{padding:40}}>Loading Order...</div>;
  if(!order) return <div style={{padding:40}}>Order not found.</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
         <div className="admin-title">
           <button onClick={() => navigate('/admin/orders')} style={{border:'none', background:'none', color:'#666', cursor:'pointer', display:'flex', alignItems:'center', gap:5, marginBottom:10}}>
             <FiArrowLeft /> Back to Orders
           </button>
           <h2>Order #{order.id}</h2>
           <p>Placed on {new Date(order.created_at).toLocaleString()}</p>
         </div>
         <div className="admin-actions">
            <select 
               value={order.status}
               onChange={(e) => handleStatusChange(e.target.value)}
               className="admin-date-picker"
               style={{background:'#e0e7ff', color:'#1e40af', border:'none', fontWeight:600}}
            >
               <option value="pending">Pending</option>
               <option value="processing">Processing</option>
               <option value="shipped">Shipped</option>
               <option value="out_for_delivery">Out for Delivery</option>
               <option value="delivered">Delivered</option>
               <option value="cancelled">Cancelled</option>
               <option value="returned">Returned</option>
            </select>
         </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:24}}>
          
          {/* Left: Items */}
          <div className="chart-card">
              <h3 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10}}><FiBox /> Items</h3>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                  <thead>
                     <tr style={{textAlign:'left', color:'#9ca3af', borderBottom:'1px solid #f3f4f6', fontSize:13}}>
                        <th style={{padding:12}}>Product</th>
                        <th style={{padding:12}}>Price</th>
                        <th style={{padding:12}}>Qty</th>
                        <th style={{padding:12}}>Total</th>
                     </tr>
                  </thead>
                  <tbody>
                     {order.items.map(item => (
                        <tr key={item.id} style={{borderBottom:'1px solid #f9fafb'}}>
                           <td style={{padding:12}}>
                              <div style={{display:'flex', alignItems:'center', gap:10}}>
                                <img src={item.image_url} style={{width:40, height:40, borderRadius:4, objectFit:'cover'}} alt="" />
                                <span style={{fontWeight:500}}>{item.name}</span>
                              </div>
                           </td>
                           <td style={{padding:12}}>₹{parseFloat(item.price).toFixed(2)}</td>
                           <td style={{padding:12}}>x{item.quantity}</td>
                           <td style={{padding:12, fontWeight:600}}>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                        </tr>
                     ))}
                  </tbody>
              </table>
              <div style={{marginTop:20, display:'flex', justifyContent:'flex-end', borderTop:'1px solid #eee', paddingTop:20}}>
                 <div style={{textAlign:'right'}}>
                    <div style={{color:'#6b7280', marginBottom:5}}>Subtotal</div>
                    <div style={{fontSize:24, fontWeight:700, color:'#10b981'}}>₹{parseFloat(order.total_price).toFixed(2)}</div>
                 </div>
              </div>
          </div>

          {/* Right: Customer & Address */}
          <div style={{display:'flex', flexDirection:'column', gap:24}}>
             <div className="chart-card">
                <h3 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10}}><FiUser /> Customer</h3>
                {order.user ? (
                   <div>
                      <div style={{fontWeight:700}}>{order.user.name}</div>
                      <div style={{color:'#6b7280', fontSize:14}}>{order.user.email}</div>
                      <a href={`/admin/customers/${order.user.id}`} style={{display:'block', marginTop:10, color:'#3b82f6', fontSize:13}}>View Profile</a>
                   </div>
                ) : (
                   <div style={{fontStyle:'italic', color:'#6b7280'}}>Guest User</div>
                )}
             </div>

             <div className="chart-card">
                <h3 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10}}><FiMapPin /> Shipping Address</h3>
                <div style={{whiteSpace:'pre-wrap', fontSize:14, color:'#4b5563', lineHeight:1.6}}>
                   {order.address || "No address provided"}
                </div>
             </div>
          </div>

      </div>
    </div>
  );
}
