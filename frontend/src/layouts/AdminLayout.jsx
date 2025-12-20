import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiShoppingBag, FiUsers, FiBox, FiSettings, FiHelpCircle, FiMessageSquare } from 'react-icons/fi';
import '../styles/Admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  
  // Basic Auth Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('is_admin') === 'true';

    // If no token, OR if token exists but user is not admin
    if(!token || !isAdmin) {
        // Redirect to admin login if they try to access admin panel
        navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
           {/* Simple Icon */}
           <div style={{width:32, height:32, background:'#10b981', borderRadius:8}}></div>
           ShoppersAdmin
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
             <FiGrid /> Dashboard
          </NavLink>
          <NavLink to="/admin/orders" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
             <FiShoppingBag /> Orders
          </NavLink>
          <NavLink to="/admin/customers" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
             <FiUsers /> Customers
          </NavLink>
          <NavLink to="/admin/products" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
             <FiBox /> Products
          </NavLink>
          <NavLink to="/admin/messages" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
             <FiMessageSquare /> Message
          </NavLink>
          <div style={{height:1, background:'#eee', margin:'10px 0'}}></div>
          <NavLink to="/admin/settings" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
             <FiSettings /> Settings
          </NavLink>
          <NavLink to="/admin/help" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
             <FiHelpCircle /> Help Center
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
