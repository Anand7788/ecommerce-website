// src/pages/UserProfile.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBox, FiLock, FiMapPin, FiCreditCard, FiHeadphones, FiUser } from 'react-icons/fi';

export default function UserProfile() {
  const navigate = useNavigate();
  // Mock user data or fetch from API if we had a /me endpoint. 
  // For now using localStorage or generic greeting.
  const userName = localStorage.getItem('user_name') || "Customer";  

  const cards = [
    {
      icon: <FiBox />,
      title: "Your Orders",
      desc: "Track, return, or buy things again",
      action: () => navigate('/orders')
    },
    {
      icon: <FiLock />,
      title: "Login & Security",
      desc: "Edit login, name, and mobile number",
      action: () => navigate('/login-security') 
    },
    {
      icon: <FiMapPin />,
      title: "Your Addresses",
      desc: "Edit addresses for orders and gifts",
      action: () => navigate('/addresses') 
    },
    {
      icon: <FiCreditCard />,
      title: "Payment Options",
      desc: "Edit or add payment methods",
      action: () => alert("Payment methods coming soon!")
    },
    {
      icon: <FiHeadphones />,
      title: "Contact Us",
      desc: "Contact our customer service",
      action: () => alert("Customer support ready to help!")
    },
    {
        icon: <FiUser />,
        title: "Your Profile",
        desc: "Manage your public profile",
        action: () => alert("Public profile settings")
    }
  ];

  return (
    <div style={{maxWidth:1000, margin:'40px auto', padding:20}}>
       <h1 style={{fontSize:28, marginBottom:20}}>Your Account</h1>
       
       <div style={{
          display:'grid', 
          gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', 
          gap:20
       }}>
          {cards.map((card, idx) => (
             <div 
               key={idx} 
               onClick={card.action}
               style={{
                  border:'1px solid #d5d9d9', 
                  borderRadius:8, 
                  padding:20, 
                  display:'flex', 
                  alignItems:'flex-start', 
                  gap:16,
                  cursor:'pointer',
                  background:'white',
                  transition: 'background 0.2s'
               }}
               onMouseEnter={(e) => e.currentTarget.style.background = '#f7f7f7'}
               onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
             >
                <div style={{fontSize:28, color:'#007185'}}>{card.icon}</div>
                <div>
                   <h3 style={{fontSize:18, fontWeight:500, marginBottom:4}}>{card.title}</h3>
                   <div style={{color:'#565959', fontSize:14}}>{card.desc}</div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}
