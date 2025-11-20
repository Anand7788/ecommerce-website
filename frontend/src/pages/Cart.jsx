import React, { useEffect, useState } from 'react';
import { getCart, updateCartItem, removeCartItem, createOrder } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Cart(){
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function load(){
    setLoading(true);
    try {
      const data = await getCart();
      setCart(data);
    } catch(e){
      console.error(e);
      alert('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function changeQty(itemId, qty){
    await updateCartItem(itemId, qty);
    await load();
  }

  async function remove(itemId){
    await removeCartItem(itemId);
    await load();
  }

  async function checkout(){
    if(!cart || !cart.id || cart.items.length === 0){
      alert('Cart is empty');
      return;
    }
    if(!address || address.trim().length < 5){
      alert('Please enter a valid address');
      return;
    }
    try {
      const order = await createOrder(cart.id, address);
      alert('Order placed: #' + order.id);
      // optional: clear cart in UI by reloading cart (backend may return empty cart)
      await load();
      navigate('/orders');
    } catch(e){
      console.error(e);
      // show backend error message if available
      const msg = e?.response?.data?.error || e?.message || 'Failed to create order';
      alert(msg + '. Make sure you are logged in.');
    }
  }

  if(loading) return <div className="container">Loading...</div>;
  if(!cart || cart.items.length === 0) return <div className="container">Cart is empty</div>;

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {cart.items.map(it => (
        <div key={it.id} className="card" style={{display:'flex', gap:12, alignItems:'center', marginBottom:8}}>
          <img src={it.product.image_url} alt="" style={{width:80, height:80, objectFit:'cover'}} />
          <div style={{flex:1}}>
            <strong>{it.product.name}</strong>
            <div className="small">₹{it.product.price}</div>
          </div>
          <div>
            <input type="number" value={it.quantity} min="1" style={{width:60}} onChange={e=>changeQty(it.id, Number(e.target.value))} />
            <div style={{marginTop:6}}><button className="button" onClick={()=>remove(it.id)}>Remove</button></div>
          </div>
        </div>
      ))}

      <h3>Total: ₹{cart.total}</h3>

      <div style={{marginTop:20}}>
        <h3>Checkout</h3>
        <textarea value={address} onChange={e=>setAddress(e.target.value)} placeholder="Shipping address" rows="3" style={{width:'100%', padding:8, boxSizing:'border-box'}} />
        <div style={{marginTop:8}}>
          <button className="button" onClick={checkout}>Place Order</button>
        </div>
      </div>
    </div>
  );
}
