// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiShoppingCart, FiShoppingBag, FiBox, FiDollarSign, FiMoreHorizontal } from 'react-icons/fi';
import { fetchAdminAnalytics } from '../api/api';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

export default function AdminDashboard() {
  const [data, setData] = useState({
    total_sales: 0,
    total_orders: 0,
    total_items: 0,
    total_revenue: 0,
    analytics: [],
    recent_orders: [],
    top_products: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        try {
            const res = await fetchAdminAnalytics();
            setData(res);
        } catch(err) {
            console.error("Failed to load analytics", err);
        } finally {
            setLoading(false);
        }
    }
    loadData();
  }, []);

  if (loading) return <div style={{padding:40}}>Loading Dashboard...</div>;

  const pieData = [
    { name: 'Online', value: 35 },
    { name: 'Shop', value: 35 }, 
    { name: 'Other', value: 30 },
  ];

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="admin-header">
         <div className="admin-title">
           <h2>Overview</h2>
           <p>{new Date().toLocaleDateString('en-US', { day:'numeric', month:'long', year:'numeric' })}</p>
         </div>
         <div className="admin-actions">
           <select className="admin-date-picker">
              <option>All Time</option>
           </select>
         </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats-grid">
         <div className="stat-card">
            <div className="stat-icon" style={{background:'#fee2e2', color:'#ef4444'}}>
               <FiShoppingCart />
            </div>
            <div className="stat-info">
               <h3>Total Sales</h3>
               <div className="stat-value">${parseFloat(data.total_sales).toFixed(2)}</div>
            </div>
         </div>
         <div className="stat-card">
            <div className="stat-icon" style={{background:'#e0e7ff', color:'#6366f1'}}>
               <FiShoppingBag />
            </div>
            <div className="stat-info">
               <h3>Total Orders</h3>
               <div className="stat-value">{data.total_orders}</div>
            </div>
         </div>
         <div className="stat-card">
            <div className="stat-icon" style={{background:'#ffedd5', color:'#f97316'}}>
               <FiBox />
            </div>
            <div className="stat-info">
               <h3>Total Items</h3>
               <div className="stat-value">{data.total_items}</div>
            </div>
         </div>
         <div className="stat-card">
            <div className="stat-icon" style={{background:'#dbeafe', color:'#3b82f6'}}>
               <FiDollarSign />
            </div>
            <div className="stat-info">
               <h3>Total Revenue</h3>
               <div className="stat-value">${parseFloat(data.total_revenue).toFixed(2)}</div>
            </div>
         </div>
      </div>

      {/* Main Charts Row */}
      <div className="charts-row">
         {/* Left: Line Chart */}
         <div className="chart-card">
            <div className="chart-header">
               <div className="chart-title">Sale Analytic</div>
               <div style={{color:'#9ca3af', fontSize:12}}>Last 6 Months</div>
            </div>
            <div style={{width:'100%', height:300}}>
               <ResponsiveContainer>
                 <AreaChart data={data.analytics.length ? data.analytics : [{name:'No Data', val1:0}]}>
                   <defs>
                     <linearGradient id="colorVal1" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} />
                   <YAxis axisLine={false} tickLine={false} />
                   <Tooltip />
                   <Area type="monotone" dataKey="val1" stroke="#8884d8" fillOpacity={1} fill="url(#colorVal1)" />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Right: Recent Orders List */}
         <div className="chart-card">
            <div className="chart-header">
               <div className="chart-title">Recent Orders</div>
            </div>
            <div className="recent-orders-list">
               {data.recent_orders.length === 0 ? <p style={{color:'#999'}}>No orders found.</p> : 
                 data.recent_orders.map(o => (
                  <div key={o.id} style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16}}>
                     <div style={{display:'flex', alignItems:'center', gap:10}}>
                        <div style={{width:40, height:40, background:'#f3f4f6', borderRadius:8}}></div>
                        <div>
                           <div style={{fontWeight:600, fontSize:14}}>{o.name}</div>
                           <div style={{fontSize:12, color:'#9ca3af'}}>Items: {o.items}</div>
                        </div>
                     </div>
                     <div style={{fontWeight:700, fontSize:14, color:'#10b981'}}>${parseFloat(o.price).toFixed(2)}</div>
                  </div>
               ))}
               <div style={{textAlign:'center', marginTop:20, color:'#6b7280', fontSize:13, cursor:'pointer'}}>View All</div>
            </div>
         </div>
      </div>

      {/* Bottom Row */}
      <div className="charts-row">
         {/* Top Selling Products */}
         <div className="chart-card">
            <div className="chart-header">
               <div className="chart-title">Top Selling Products</div>
               <select className="admin-date-picker" style={{padding:'4px 8px'}}><option>All Time</option></select>
            </div>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
               <thead>
                  <tr style={{textAlign:'left', color:'#9ca3af', fontSize:13, borderBottom:'1px solid #f3f4f6'}}>
                     <th style={{paddingBottom:12}}>Product</th>
                     <th style={{paddingBottom:12}}>Status</th>
                     <th style={{paddingBottom:12}}>Sales</th>
                     <th style={{paddingBottom:12}}>Earning</th>
                  </tr>
               </thead>
               <tbody>
                  {data.top_products.length === 0 ? <tr><td colSpan="4" style={{padding:20, textAlign:'center'}}>No sales yet</td></tr> :
                    data.top_products.map((p, idx) => (
                     <tr key={idx} style={{borderBottom:'1px solid #f9fafb'}}>
                        <td style={{padding:'12px 0', display:'flex', alignItems:'center', gap:10}}>
                           <span style={{fontWeight:500}}>{p.name}</span>
                        </td>
                        <td style={{padding:'12px 0'}}>
                           <span style={{
                              padding:'4px 8px', borderRadius:4, fontSize:12,
                              background: '#d1fae5', color: '#065f46'
                           }}>{p.status}</span>
                        </td>
                        <td style={{padding:'12px 0'}}>{p.sales}</td>
                        <td style={{padding:'12px 0'}}>${parseFloat(p.earning).toFixed(2)}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Monthly Profits (Still Dummy for now as we don't have cost price/profit logic) */}
         <div className="chart-card" style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
            <div className="chart-header" style={{width:'100%'}}>
               <div className="chart-title">Distribution</div>
               <FiMoreHorizontal />
            </div>
            
            <div style={{width:200, height:200, position:'relative'}}>
               <ResponsiveContainer>
                  <PieChart>
                     <Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value">
                        {pieData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Pie>
                  </PieChart>
               </ResponsiveContainer>
               <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', textAlign:'center'}}>
                  <div style={{fontSize:12, color:'#9ca3af'}}>Total</div>
                  <div style={{fontWeight:700}}>${parseFloat(data.total_revenue).toFixed(0)}</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
