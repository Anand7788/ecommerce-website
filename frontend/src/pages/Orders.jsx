import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../api/api';
import { Link } from 'react-router-dom';
import '../styles/Orders.css';

export default function Orders(){
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetchOrders()
      .then(data => {
        // Sort by id desc (newest first)
        const sorted = data.sort((a,b) => b.id - a.id);
        setOrders(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter logic
  const filteredOrders = orders.filter(o => {
    if(activeTab === 'All') return true;
    // Map backend status to UI tabs if needed.
    // Assuming backend returns "pending", "delivered", "cancelled" etc.
    // We'll do a loose match or default to 'In Progress' for pending.
    const status = (o.status || 'pending').toLowerCase();
    
    if(activeTab === 'In Progress') return status === 'pending' || status === 'processing' || status === 'shipped';
    if(activeTab === 'Delivered') return status === 'delivered' || status === 'completed';
    if(activeTab === 'Cancelled') return status === 'cancelled';
    return true;
  });

  const formatDate = (dateString) => {
    if(!dateString) return 'Date N/A';
    return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Helper to get status class
  const getStatusClass = (status) => {
    const s = (status || 'pending').toLowerCase();
    if(s === 'delivered' || s === 'completed') return 'delivered';
    if(s === 'cancelled') return 'cancelled';
    return 'in-progress';
  };

  // Helper to get display status text
  const getStatusLabel = (status) => {
    const s = (status || 'pending').toLowerCase();
    if(s === 'pending') return 'In Progress';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  if(loading) return <div className="container" style={{marginTop:40}}>Loading orders...</div>;

  return (
    <div className="orders-page">
      <div className="orders-breadcrumb">
        <Link to="/">Home</Link> &gt; <span>My Orders</span>
      </div>

      <div className="orders-filter-bar">
        <div className="orders-tabs">
          {['All', 'In Progress', 'Delivered', 'Cancelled'].map(tab => (
            <button 
              key={tab} 
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div style={{color:'#666', marginTop:20}}>No orders found in this category.</div>
      ) : (
        <div className="orders-list">
           {filteredOrders.map(order => {
             // Derive main item info for the card preview
             const firstItem = order.order_items && order.order_items.length > 0 ? order.order_items[0] : null;
             const otherCount = order.order_items.length - 1;

             return (
               <div key={order.id} className="order-card">
                  <div className="order-header">
                     <span className={`status-badge ${getStatusClass(order.status)}`}>
                        ● {getStatusLabel(order.status)}
                     </span>
                     <span className="order-date">{formatDate(order.created_at)}</span>
                  </div>

                  <div className="order-content">
                     {/* Thumbnail */}
                     {firstItem && (
                        <img 
                          src={firstItem.product.image_url || 'https://via.placeholder.com/80'} 
                          alt="Product" 
                          className="order-thumb"
                        />
                     )}

                     {/* Info */}
                     <div className="order-info">
                        <span className="order-id">Order ID: #{order.id}</span>
                        {firstItem ? (
                           <span className="order-title">
                              {firstItem.product.name} 
                              {otherCount > 0 && <span style={{color:'#991b1b', fontWeight:600}}> & {otherCount} more items</span>}
                           </span>
                        ) : (
                           <span className="order-title">No items</span>
                        )}
                        <div className="order-total">₹{Math.floor(order.total_price).toLocaleString()}</div>
                     </div>

                     {/* Arrow */}
                     <div className="order-arrow">
                        &gt;
                     </div>
                  </div>
               </div>
             );
           })}
        </div>
      )}
    </div>
  );
}
