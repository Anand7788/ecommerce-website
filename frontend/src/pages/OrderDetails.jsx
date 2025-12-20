import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrder } from '../api/api';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder(id)
      .then(setOrder)
      .catch(err => {
          console.error(err);
          alert("Failed to load order");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if(loading) return <div style={{padding:40}}>Loading Order...</div>;
  if(!order) return <div style={{padding:40}}>Order not found.</div>;

  return (
    <div style={{maxWidth:1000, margin:'40px auto', padding:20}}>
        <div style={{fontSize:14, marginBottom:20, color:'#565959'}}>
           <span style={{cursor:'pointer', textDecoration:'underline'}} onClick={() => navigate('/orders')}>Your Orders</span> › Order Details
        </div>

        <h1 style={{fontSize:28, marginBottom:10}}>Order Details</h1>
        <div style={{fontSize:14, color:'#565959', marginBottom:24}}>
            Ordered on {new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} | Order # {order.id}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:24}}>
            {/* Left: Items */}
            <div style={{border:'1px solid #d5d9d9', borderRadius:8, background:'white', overflow:'hidden'}}>
               <div style={{padding:20, borderBottom:'1px solid #eee', fontWeight:700, fontSize:16}}>Shipment Details</div>
               <div style={{padding:20}}>
                   <div style={{marginBottom:15, color:'#065f46', fontWeight:700}}>
                       Status: {order.status ? order.status.toUpperCase() : 'PENDING'}
                   </div>
                   
                   {order.order_items && order.order_items.map(item => (
                       <div key={item.id} style={{display:'flex', gap:15, marginBottom:20}}>
                           <img src={item.product?.image_url || 'https://via.placeholder.com/80'} style={{width:80, height:80, objectFit:'contain'}} alt="" />
                           <div>
                               <div style={{fontWeight:600, color:'#007185', marginBottom:4}}>{item.product?.name}</div>
                               <div style={{fontSize:14, color:'#565959'}}>Quantity: {item.quantity}</div>
                               <div style={{fontSize:14, color:'#b12704', fontWeight:700}}>₹{item.price}</div>
                           </div>
                       </div>
                   ))}
               </div>
            </div>

            {/* Right: Summary */}
            <div style={{display:'flex', flexDirection:'column', gap:20}}>
               {/* Address */}
               <div style={{border:'1px solid #d5d9d9', borderRadius:8, background:'white', padding:20}}>
                   <div style={{fontWeight:700, marginBottom:10}}>Shipping Address</div>
                   <div style={{fontSize:14, lineHeight:1.5, color:'#111'}}>
                       {order.address}
                   </div>
               </div>

               {/* Payment Summary */}
               <div style={{border:'1px solid #d5d9d9', borderRadius:8, background:'white', padding:20}}>
                   <div style={{fontWeight:700, marginBottom:10}}>Order Summary</div>
                   <div style={{display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:14}}>
                       <span>Item(s) Subtotal:</span>
                       <span>₹{parseFloat(order.total_price).toFixed(2)}</span>
                   </div>
                   <div style={{display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:14}}>
                       <span>Shipping:</span>
                       <span>₹0.00</span>
                   </div>
                   <div style={{display:'flex', justifyContent:'space-between', marginTop:10, paddingTop:10, borderTop:'1px solid #eee', fontWeight:700, fontSize:18, color:'#B12704'}}>
                       <span>Grand Total:</span>
                       <span>₹{parseFloat(order.total_price).toFixed(2)}</span>
                   </div>
               </div>
            </div>
        </div>
    </div>
  );
}
