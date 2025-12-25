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

      <div className="admin-details-grid">
          
          {/* Left Column: Profile & Address */}
          <div style={{display:'flex', flexDirection:'column', gap:24}}>
             {/* Combined Profile & Address Card */}
             <div className="chart-card" style={{padding: '20px'}}>
                {/* Profile Section */}
                <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:8, marginBottom:16}}>
                   <div style={{width:56, height:56, borderRadius:'50%', background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:700, color:'#6b7280'}}>
                      {customer.name.charAt(0).toUpperCase()}
                   </div>
                   <div style={{textAlign: 'center'}}>
                      <div style={{fontWeight:700, fontSize:16}}>{customer.name}</div>
                      <div style={{color:'#6b7280', fontSize:13}}>{customer.email}</div>
                   </div>
                </div>

                {/* Stats */}
                <div>
                   <div className="mobile-card-row" style={{marginBottom:6}}>
                       <span className="mobile-card-label" style={{fontSize:12}}>Joined</span>
                       <span className="mobile-card-value" style={{fontSize:13}}>{new Date(customer.created_at).toLocaleDateString()}</span>
                   </div>
                   <div className="mobile-card-row" style={{marginBottom:6}}>
                       <span className="mobile-card-label" style={{fontSize:12}}>Total Spent</span>
                       <span className="mobile-card-value" style={{color:'#10b981', fontWeight:700, fontSize:13}}>
                         ₹{parseFloat(customer.stats.total_spent).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                       </span>
                   </div>
                   <div className="mobile-card-row">
                       <span className="mobile-card-label" style={{fontSize:12}}>Total Orders</span>
                       <span className="mobile-card-value" style={{fontSize:13}}>{customer.stats.total_orders}</span>
                   </div>
                </div>

                {/* Divider */}
                <hr style={{border:'none', borderTop:'1px solid #f3f4f6', margin:'12px 0'}} />

                {/* Address Section */}
                <div>
                    <h4 style={{fontSize:13, fontWeight:600, marginBottom:8, display:'flex', alignItems:'center', gap:6, color:'#374151'}}>
                        <FiMapPin size={14} /> Shipping Address
                    </h4>
                    <div style={{fontSize:13, color:'#4b5563', lineHeight:1.5, paddingLeft: 20}}>
                       {customer.address ? (
                          <div style={{whiteSpace:'pre-wrap'}}>{customer.address}</div>
                       ) : (
                          <div style={{color:'#9ca3af', fontStyle:'italic'}}>No address recorded yet.</div>
                       )}
                    </div>
                </div>
             </div>
          </div>

          {/* Right Column: Order History */}
          <div className="chart-card">
             <h3 style={{marginBottom:24, display:'flex', alignItems:'center', gap:10}}><FiPackage /> Order History</h3>
             {customer.orders.length === 0 ? (
                <div style={{color:'#9ca3af', textAlign:'center', padding:40}}>No orders yet.</div>
             ) : (
                <>
                    {/* Desktop Table */}
                    <div className="desktop-table-container">
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
                    </div>

                    {/* Mobile Card List */}
                    <div className="mobile-list">
                        {customer.orders.map(o => (
                            <div key={o.id} className="mobile-card">
                                <div className="mobile-card-row" style={{marginBottom:12, borderBottom:'1px solid #f3f4f6', paddingBottom:8}}>
                                    <span style={{fontWeight:600, color:'#111'}}>#{o.id}</span>
                                    <span style={{fontSize:12, color:'#6b7280'}}>{new Date(o.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="mobile-card-row">
                                    <span className="mobile-card-label">Status</span>
                                    <span style={{
                                         padding:'2px 8px', borderRadius:8, fontSize:12,
                                         background: o.status === 'delivered' ? '#d1fae5' : '#f3f4f6',
                                         color: o.status === 'delivered' ? '#065f46' : '#374151',
                                         fontWeight: 500
                                      }}>{o.status}</span>
                                </div>
                                <div className="mobile-card-row">
                                    <span className="mobile-card-label">Items</span>
                                    <span className="mobile-card-value">{o.items_count}</span>
                                </div>
                                <div className="mobile-card-row">
                                    <span className="mobile-card-label">Total</span>
                                    <span className="mobile-card-value" style={{fontWeight:700, color:'#10b981'}}>₹{parseFloat(o.total_price).toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
             )}
          </div>

      </div>
    </div>
  );
}
