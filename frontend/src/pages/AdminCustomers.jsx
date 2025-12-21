// src/pages/AdminCustomers.jsx
import React, { useEffect, useState } from 'react';
import { fetchAdminCustomers } from '../api/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminCustomers();
        setCustomers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if(loading) return <div style={{padding:40}}>Loading Customers...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
         <div className="admin-title">
           <h2>Customers</h2>
           <p>View registered users</p>
         </div>
      </div>

      <div className="chart-card">
         <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
               <tr style={{textAlign:'left', color:'#9ca3af', borderBottom:'1px solid #f3f4f6'}}>
                  <th style={{padding:12}}>Name</th>
                  <th style={{padding:12}}>Email</th>
                  <th style={{padding:12}}>Joined</th>
                  <th style={{padding:12}}>Orders</th>
                  <th style={{padding:12}}>Total Spent</th>
               </tr>
            </thead>
            <tbody>
               {customers.map(user => (
                  <tr key={user.id} style={{borderBottom:'1px solid #f9fafb'}}>
                     <td style={{padding:12, fontWeight:500}}>
                        <div style={{display:'flex', alignItems:'center', gap:10}}>
                           <div style={{width:32, height:32, borderRadius:'50%', background:'#d1fae5', display:'flex', alignItems:'center', justifyContent:'center', color:'#065f46', fontSize:14}}>
                              {user.name.charAt(0).toUpperCase()}
                           </div>
                           {user.name}
                        </div>
                     </td>
                     <td style={{padding:12}}>{user.email}</td>
                     <td style={{padding:12}}>{new Date(user.created_at).toLocaleDateString()}</td>
                     <td style={{padding:12}}>{user.total_orders}</td>
                     <td style={{padding:12}}>₹{parseFloat(user.total_spent || 0).toFixed(2)}</td>
                     <td style={{padding:12}}>
                       <a href={`/admin/customers/${user.id}`} style={{color:'#3b82f6', textDecoration:'none', fontSize:13, fontWeight:600}}>View Details</a>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
