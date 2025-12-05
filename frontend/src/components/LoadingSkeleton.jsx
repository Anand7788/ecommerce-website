import React from 'react';

export default function LoadingSkeleton({ rows = 8 }) {
  const items = Array.from({ length: rows });
  return (
    <div className="product-grid" aria-hidden>
      {items.map((_, i) => (
        <div className="card skeleton" key={i}>
          <div className="s-img" />
          <div style={{height:12, width:'70%', margin:'12px 0', background:'#eee', borderRadius:6}} />
          <div style={{height:10, width:'40%', background:'#eee', borderRadius:6}} />
          <div style={{flex:1}} />
          <div style={{height:36, marginTop:12, background:'#eee', borderRadius:8}} />
        </div>
      ))}
    </div>
  );
}
