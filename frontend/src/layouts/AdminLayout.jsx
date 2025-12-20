import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiShoppingBag, FiUsers, FiBox, FiSettings, FiHelpCircle, FiMessageSquare, FiLogOut } from 'react-icons/fi';
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('user_name');
    window.dispatchEvent(new Event("authChange"));
    navigate('/admin/login');
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{display:'flex', flexDirection:'column'}}>
        <div className="admin-logo">
           {/* Simple Icon */}
           <div style={{width:32, height:32, background:'#10b981', borderRadius:8}}></div>
           ShoppersAdmin
        </div>

        <nav className="admin-nav" style={{flex:1, display:'flex', flexDirection:'column'}}>
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
          
          <div style={{marginTop:'auto'}}>
            <button 
              onClick={handleLogout} 
              className="admin-nav-item" 
              style={{
                width:'100%', 
                background:'none', 
                border:'none', 
                cursor:'pointer', 
                color:'#d32f2f', 
                display:'flex', 
                alignItems:'center', 
                gap:10, 
                fontSize:15,
                padding: '10px 12px',
                textAlign: 'left'
              }}>
              <FiLogOut /> Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
