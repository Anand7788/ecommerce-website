import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart } from '../api/api';

export default function Navbar(){
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const token = localStorage.getItem('token');

  async function loadCartCount(){
    try {
      const data = await getCart();
      const count = data?.items?.reduce((s,i)=>s + (i.quantity||0), 0) || 0;
      setCartCount(count);
    } catch(e){
      // ignore
    }
  }

  useEffect(() => {
    loadCartCount();
    // refresh cart count every 25s while on page (nice UX for demo)
    const id = setInterval(loadCartCount, 25000);
    return ()=>clearInterval(id);
  }, []);

  function logout(){
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <nav className="nav">
      <div className="brand"><Link to="/" style={{color:'inherit'}}>Shopperspoint</Link></div>

      <div className="right">
        <Link to="/cart" style={{display:'inline-flex',alignItems:'center', gap:8}} className="nav-btn">
          Cart {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </Link>

        <Link to="/orders" className="nav-btn">Orders</Link>

        {token ? (
          <button onClick={logout} className="nav-btn" style={{marginLeft:8}}>Logout</button>
        ) : (
          <Link to="/login" className="nav-btn" style={{marginLeft:8}}>Login</Link>
        )}
      </div>
    </nav>
  );
}
