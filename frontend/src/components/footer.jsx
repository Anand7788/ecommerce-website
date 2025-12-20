import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand + description */}
        <div className="footer-column">
          <div className="footer-brand">
            {/* Shopcart Logo from Navbar */}
            <div style={{ position:'relative', marginRight:8 }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#003d29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <circle cx="9" cy="21" r="1"></circle>
                 <circle cx="20" cy="21" r="1"></circle>
                 <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
               </svg>
               <div style={{position:'absolute', top:-2, right:-2, width:8, height:8, background:'#ff6f00', borderRadius:'50%'}}></div>
            </div>
            <span className="footer-brand-text" style={{ color: '#003d29' }}>ShoppersPoint</span>
          </div>
          <p className="footer-text">
            Simple, modern ecommerce demo built with React & Ruby on Rails –
            browse products, manage your cart, and place orders end-to-end.
          </p>
        </div>

        {/* Quick links */}
        <div className="footer-column">
          <h4 className="footer-title">Quick links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home / Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/login">Login / Signup</Link></li>
          </ul>
        </div>

        {/* Tech / project info */}
        <div className="footer-column">
          <h4 className="footer-title">Tech stack</h4>
          <ul className="footer-tags">
            <li>React</li>
            <li>Vite</li>
            <li>Ruby on Rails API</li>
            <li>PostgreSQL</li>
            <li>Netlify & Render</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} ShoppersPoint. All rights reserved.</span>
        <span className="footer-bottom-right">
          Built as a portfolio project.
        </span>
      </div>
    </footer>
  );
}
