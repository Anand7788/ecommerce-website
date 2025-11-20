import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../api/api';

export default function Orders(){
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  return (
    <div className="container">
      <h2>Your Orders</h2>

      {orders.length === 0 && "No orders found"}

      {orders.map(order => (
        <div key={order.id} className="card" style={{marginBottom:10}}>
          <strong>Order #{order.id}</strong>
          <div>Total: ₹{order.total_price}</div>
          <div>Status: {order.status}</div>

          <div>
            {order.order_items.map(item => (
              <div key={item.id} className="small">
                {item.quantity} × {item.product.name} — ₹{item.price}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
