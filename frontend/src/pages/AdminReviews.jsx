import React, { useEffect, useState } from 'react';
import { fetchAdminReviews, deleteAdminReview } from '../api/api';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      const data = await fetchAdminReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if(!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteAdminReview(id);
      loadReviews(); // Refresh list
    } catch(err) {
      alert("Failed to delete review");
    }
  }

  const renderStars = (rating) => {
    return (
        <span style={{color:'#fbbf24', fontSize:14}}>
            {"★".repeat(rating)}{"☆".repeat(5-rating)}
        </span>
    );
  };

  if(loading) return <div style={{padding:40}}>Loading Reviews...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
         <div className="admin-title">
           <h2>Product Reviews</h2>
           <p>Manage and moderate user reviews</p>
         </div>
      </div>

      <div className="chart-card">
         <div className="desktop-table-container">
           <table style={{width:'100%', borderCollapse:'collapse'}}>
             <thead>
                <tr style={{textAlign:'left', color:'#9ca3af', borderBottom:'1px solid #f3f4f6'}}>
                   <th style={{padding:12}}>Product</th>
                   <th style={{padding:12}}>User</th>
                   <th style={{padding:12}}>Rating</th>
                   <th style={{padding:12}}>Comment</th>
                   <th style={{padding:12}}>Date</th>
                   <th style={{padding:12}}>Action</th>
                </tr>
             </thead>
             <tbody>
                {reviews.map(review => (
                   <tr key={review.id} style={{borderBottom:'1px solid #f9fafb'}}>
                      <td style={{padding:12}}>
                         <div style={{display:'flex', alignItems:'center', gap:10}}>
                             <img 
                                src={review.product.image_url} 
                                alt={review.product.name}
                                style={{width:32, height:32, objectFit:'cover', borderRadius:4}}
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                             />
                             <div style={{fontWeight:500, fontSize:14}}>{review.product.name}</div>
                         </div>
                      </td>
                      <td style={{padding:12}}>
                         <div style={{fontWeight:500, fontSize:14}}>{review.user.name}</div>
                         <div style={{fontSize:12, color:'#6b7280'}}>{review.user.mobile || 'No mobile'}</div>
                         <a href={`/admin/customers/${review.user.id}`} style={{fontSize:12, color:'#4f46e5', textDecoration:'none', fontWeight:500, marginTop:4, display:'inline-block'}}>View Profile</a>
                      </td>
                      <td style={{padding:12}}>{renderStars(review.rating)}</td>
                      <td style={{padding:12, maxWidth:300, fontSize:14, color:'#4b5563'}}>
                          {review.comment || <span style={{color:'#9ca3af', fontStyle:'italic'}}>No comment</span>}
                      </td>
                      <td style={{padding:12}}>{new Date(review.created_at).toLocaleDateString()}</td>
                      <td style={{padding:12}}>
                         <button onClick={() => handleDelete(review.id)} style={{color:'#ef4444', background:'none', border:'none', cursor:'pointer', fontWeight:600}}>Delete</button>
                      </td>
                   </tr>
                ))}
                {reviews.length === 0 && <tr><td colSpan="6" style={{padding:20, textAlign:'center'}}>No reviews found</td></tr>}
             </tbody>
           </table>
         </div>

         <div className="mobile-list">
             {reviews.map(review => (
                 <div key={review.id} className="mobile-card">
                     <div className="mobile-card-row" style={{borderBottom:'1px solid #eee', paddingBottom:8, marginBottom:12, alignItems:'center'}}>
                         <div style={{display:'flex', alignItems:'center', gap:10}}>
                             <img 
                                src={review.product.image_url} 
                                alt={review.product.name}
                                style={{width:40, height:40, objectFit:'cover', borderRadius:4}}
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                             />
                             <div style={{fontWeight:600, fontSize:14, flex:1}}>{review.product.name}</div>
                         </div>
                         <button onClick={() => handleDelete(review.id)} style={{color:'#ef4444', background:'none', border:'none', cursor:'pointer', fontSize:14, fontWeight:600}}>Delete</button>
                     </div>

                     {/* User Info Block */}
                     <div style={{marginBottom:12}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                            <div>
                                <div style={{fontWeight:600, fontSize:14, color:'#1f2937'}}>{review.user.name}</div>
                                <div style={{fontSize:13, color:'#4b5563', display:'flex', alignItems:'center', gap:4, marginTop:2}}>
                                    <span>📞</span> {review.user.mobile ? review.user.mobile : <span style={{color:'#9ca3af'}}>No contact info</span>}
                                </div>
                            </div>
                            <a href={`/admin/customers/${review.user.id}`} style={{
                                fontSize:12, fontWeight:500, color:'#4f46e5', background:'#e0e7ff', padding:'4px 8px', borderRadius:6, textDecoration:'none'
                            }}>
                                View Profile
                            </a>
                        </div>
                     </div>

                     <div className="mobile-card-row">
                         <span className="mobile-card-label">Rating</span>
                         <span className="mobile-card-value">{renderStars(review.rating)}</span>
                     </div>
                     <div style={{marginTop:8, background:'#f9fafb', padding:8, borderRadius:6, fontSize:13, color:'#4b5563', fontStyle: review.comment ? 'normal' : 'italic'}}>
                         "{review.comment || 'No comment provided'}"
                     </div>
                     <div style={{marginTop:8, fontSize:12, color:'#9ca3af', textAlign:'right'}}>
                         Failed {new Date(review.created_at).toLocaleDateString()}
                     </div>
                 </div>
             ))}
             {reviews.length === 0 && <div style={{padding:20, textAlign:'center', color:'#999'}}>No reviews found</div>}
         </div>
      </div>
    </div>
  );
}
