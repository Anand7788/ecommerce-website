// src/pages/AdminOrders.jsx
import React, { useEffect, useState } from 'react';
import { fetchAdminOrders, updateOrderStatus } from '../api/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const data = await fetchAdminOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      // Optimistic update
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return { bg: '#d1fae5', text: '#065f46' };
      case 'shipped': return { bg: '#dbeafe', text: '#1e40af' };
      case 'pending': return { bg: '#fef3c7', text: '#92400e' };
      case 'cancelled': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  if(loading) return <div style={{padding:40}}>Loading Orders...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
         <div className="admin-title">
           <h2>Orders</h2>
           <p>Manage customer orders</p>
         </div>
      </div>

      <div className="chart-card">
         <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
               <tr style={{textAlign:'left', color:'#9ca3af', borderBottom:'1px solid #f3f4f6'}}>
                  <th style={{padding:12}}>Order ID</th>
                  <th style={{padding:12}}>Customer</th>
                  <th style={{padding:12}}>Date</th>
                  <th style={{padding:12}}>Total</th>
                  <th style={{padding:12}}>Status</th>
                  <th style={{padding:12}}>Items</th>
               </tr>
            </thead>
            <tbody>
               {orders.map(order => {
                 const style = getStatusColor(order.status);
                 return (
                  <tr key={order.id} style={{borderBottom:'1px solid #f9fafb'}}>
                     <td style={{padding:12}}>#{order.id}</td>
                     <td style={{padding:12}}>
                        <div style={{fontWeight:500}}>{order.user.name}</div>
                        <div style={{fontSize:12, color:'#9ca3af'}}>{order.user.email}</div>
                     </td>
                     <td style={{padding:12}}>{new Date(order.created_at).toLocaleDateString()}</td>
                     <td style={{padding:12}}>${parseFloat(order.total_price).toFixed(2)}</td>
                     <td style={{padding:12}}>
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={{
                             padding:'4px 8px', borderRadius:8, border:'none',
                             background: style.bg, color: style.text, fontWeight:500, cursor:'pointer'
                          }}
                        >
                           <option value="pending">Pending</option>
                           <option value="shipped">Shipped</option>
                           <option value="delivered">Delivered</option>
                           <option value="cancelled">Cancelled</option>
                        </select>
                     </td>
                     <td style={{padding:12}}>{order.items_count}</td>
                     <td style={{padding:12}}>
                        <a href={`/admin/orders/${order.id}`} style={{color:'#3b82f6', textDecoration:'none', fontSize:13, fontWeight:600}}>View Order</a>
                     </td>
                  </tr>
                 );
               })}
            </tbody>
         </table>
      </div>
    </div>
  );
}
