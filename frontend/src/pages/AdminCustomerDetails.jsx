// src/pages/AdminCustomerDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAdminCustomer } from '../api/api';
import { FiUser, FiMapPin, FiPackage, FiArrowLeft } from 'react-icons/fi';

export default function AdminCustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminCustomer(id);
        setCustomer(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load customer");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if(loading) return <div style={{padding:40}}>Loading Details...</div>;
  if(!customer) return <div style={{padding:40}}>Customer not found.</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
         <div className="admin-title">
           <button onClick={() => navigate('/admin/customers')} style={{border:'none', background:'none', color:'#666', cursor:'pointer', display:'flex', alignItems:'center', gap:5, marginBottom:10}}>
             <FiArrowLeft /> Back to Customers
           </button>
           <h2>Customer Details</h2>
           <p>Profile and order history for {customer.name}</p>
         </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:24}}>
          
          {/* Left Column: Profile & Address */}
          <div style={{display:'flex', flexDirection:'column', gap:24}}>
             {/* Profile Card */}
             <div className="chart-card">
                <h3 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10}}><FiUser /> Profile</h3>
                <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:20}}>
                   <div style={{width:60, height:60, borderRadius:'50%', background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:700, color:'#6b7280'}}>
                      {customer.name.charAt(0).toUpperCase()}
                   </div>
                   <div>
                      <div style={{fontWeight:700, fontSize:18}}>{customer.name}</div>
                      <div style={{color:'#6b7280', fontSize:14}}>{customer.email}</div>
                   </div>
                </div>
                <div style={{fontSize:14, color:'#4b5563'}}>
                   <div style={{marginBottom:8}}><strong>Joined:</strong> {new Date(customer.created_at).toLocaleDateString()}</div>
                   <div style={{marginBottom:8}}><strong>Total Spent:</strong> ₹{parseFloat(customer.stats.total_spent).toFixed(2)}</div>
                   <div><strong>Total Orders:</strong> {customer.stats.total_orders}</div>
                </div>
             </div>

             {/* Address Card */}
             <div className="chart-card">
                <h3 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10}}><FiMapPin /> Shipping Address</h3>
                <div style={{fontSize:14, color:'#4b5563', lineHeight:1.6}}>
                   {customer.address ? (
                      <div style={{whiteSpace:'pre-wrap'}}>{customer.address}</div>
                   ) : (
                      <div style={{color:'#9ca3af', fontStyle:'italic'}}>No address recorded yet.</div>
                   )}
                </div>
             </div>
          </div>

          {/* Right Column: Order History */}
          <div className="chart-card">
             <h3 style={{marginBottom:24, display:'flex', alignItems:'center', gap:10}}><FiPackage /> Order History</h3>
             {customer.orders.length === 0 ? (
                <div style={{color:'#9ca3af', textAlign:'center', padding:40}}>No orders yet.</div>
             ) : (
                <table style={{width:'100%', borderCollapse:'collapse'}}>
                  <thead>
                     <tr style={{textAlign:'left', color:'#9ca3af', borderBottom:'1px solid #f3f4f6', fontSize:13}}>
                        <th style={{padding:12}}>Order ID</th>
                        <th style={{padding:12}}>Date</th>
                        <th style={{padding:12}}>Status</th>
                        <th style={{padding:12}}>Items</th>
                        <th style={{padding:12}}>Total</th>
                     </tr>
                  </thead>
                  <tbody>
                     {customer.orders.map(o => (
                        <tr key={o.id} style={{borderBottom:'1px solid #f9fafb'}}>
                           <td style={{padding:12}}>#{o.id}</td>
                           <td style={{padding:12}}>{new Date(o.created_at).toLocaleDateString()}</td>
                           <td style={{padding:12}}>
                              <span style={{
                                 padding:'2px 8px', borderRadius:8, fontSize:12,
                                 background: o.status === 'delivered' ? '#d1fae5' : '#f3f4f6',
                                 color: o.status === 'delivered' ? '#065f46' : '#374151'
                              }}>{o.status}</span>
                           </td>
                           <td style={{padding:12}}>{o.items_count}</td>
                           <td style={{padding:12}}>₹{parseFloat(o.total_price).toFixed(2)}</td>
                        </tr>
                     ))}
                  </tbody>
                </table>
             )}
          </div>

      </div>
    </div>
  );
}
