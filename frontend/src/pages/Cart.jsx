import React, { useEffect, useState } from 'react';
import { getCart, updateCartItem, removeCartItem, createOrder } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';


export default function Cart(){
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // We mock these for the UI reference, as backend doesn't provide them yet
  const discount = 113; 
  const deliveryFee = 15;

  async function load(){
    setLoading(true);
    try {
      const data = await getCart();
      setCart(data);
    } catch(e){
      console.error(e);
      // alert('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function changeQty(itemId, newQty){
    if (newQty < 1) return;
    await updateCartItem(itemId, newQty);
    await load();
  }

  async function remove(itemId){
    await removeCartItem(itemId);
    await load();
  }

  async function handleCheckout(){
    // For now, we just navigate to a simple checkout/orders flow
    // In a real app, this would open a checkout modal or page
    if(!cart || cart.items.length === 0) {
      alert("Cart is empty");
      return;
    }
    const address = prompt("Please enter shipping address:", "123 Main St, New York, NY");
    if(!address) return;

    try {
      await createOrder(cart.id, address);
      alert("Order placed successfully!");
      navigate('/orders');
    } catch(e) {
      console.error(e);
      alert("Failed to place order.");
    }
  }

  if(loading) return <div className="container" style={{paddingTop:40}}>Loading...</div>;

  if(!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container" style={{paddingTop:40, textAlign:'center'}}>
        <h2>Your Cart is Empty</h2>
        <Link to="/" className="button" style={{marginTop:20, display:'inline-block'}}>Go Shopping</Link>
      </div>
    );
  }

  // Calculate Subtotal from items
  const subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="container cart-page">
      {/* Breadcrumb */}
      <div className="cart-breadcrumb">
        <Link to="/">Home</Link> &gt; Cart
      </div>

      <h1 className="cart-title">YOUR CART</h1>

      <div className="cart-grid">
        {/* Left: Cart Items */}
        <div className="cart-items">
          {cart.items.map((item) => (
             <div key={item.id} className="cart-item-card">
                <div className="cart-img-box">
                  <img src={item.product.image_url} alt={item.product.name} />
                </div>
                <div className="cart-item-info">
                   <div className="cart-item-header">
                     <h3>{item.product.name}</h3>
                     <button className="btn-delete" onClick={() => remove(item.id)}>
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                     </button>
                   </div>
                   
                   <p className="cart-variant">Size: Medium <br/> Color: Red</p>
                   
                   <div className="cart-item-bottom">
                      <span className="cart-price">${Math.floor(item.product.price)}</span>
                      
                      <div className="qty-stepper">
                        <button onClick={() => changeQty(item.id, item.quantity - 1)}>–</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => changeQty(item.id, item.quantity + 1)}>+</button>
                      </div>
                   </div>
                </div>
             </div>
          ))}
        </div>

        {/* Right: Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span className="summary-val">${subtotal}</span>
          </div>
          <div className="summary-row" style={{color:'#ef4444'}}>
            <span>Discount (-20%)</span>
            <span className="summary-val">-${discount}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span className="summary-val">${deliveryFee}</span>
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-row total">
            <span>Total</span>
            <span>${Math.max(0, total)}</span>
          </div>

          <button className="btn-checkout" onClick={() => navigate('/checkout')} style={{marginTop:20}}>
            Go to Checkout &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
