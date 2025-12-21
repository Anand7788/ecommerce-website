import React from 'react';
import { RotateCcw, BadgeCheck, Truck } from 'lucide-react';

export function ServiceStrip() {
  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    color: 'white',
    flex: 1,
    justifyContent: 'center',
    minWidth: 200
  };

  const textStyle = {
    display: 'flex',
    flexDirection: 'column',
    fontWeight: 700,
    fontSize: 15,
    lineHeight: 1.2
  };

  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)', // Violet to Purple
      padding: '16px 24px',
      borderRadius: 99,
      border: '4px solid #fcd34d', // Gold border
      boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.4)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 32
    }}>
      <div style={itemStyle}>
        <RotateCcw size={32} color="#fcd34d" />
        <div style={textStyle}>
          <span>Easy</span>
          <span>Returns</span>
        </div>
      </div>

      <div className="divider" style={{width: 1, height: 40, background: 'rgba(255,255,255,0.2)'}}></div>

      <div style={itemStyle}>
        <BadgeCheck size={32} color="#fcd34d" />
        <div style={textStyle}>
          <span>Top Rated</span>
          <span>Products</span>
        </div>
      </div>

      <div className="divider" style={{width: 1, height: 40, background: 'rgba(255,255,255,0.2)'}}></div>

      <div style={itemStyle}>
        <Truck size={32} color="#fcd34d" />
        <div style={textStyle}>
          <span>Cash</span>
          <span>on Delivery</span>
        </div>
      </div>
    </div>
  );
}

export function DealsGrid() {
  const cards = [
    { title: "Digital Watches", subtitle: "Top Trends", price: "60", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200", color: '#ffedd5' }, // Orange tint
    { title: "Men's Joggers", subtitle: "Comfy & Trendy", price: "149", img: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&q=80&w=200", color: '#dbeafe' }, // Blue tint
    { title: "Elegant Sarees", subtitle: "Traditional Steals", price: "219", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=200", color: '#fce7f3' }, // Pink tint
    { title: "Backpacks", subtitle: "Top Essentials", price: "170", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=200", color: '#d1fae5' }, // Green tint
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 16,
      marginBottom: 32
    }}>
      {cards.map((card, idx) => (
        <div key={idx} style={{
          background: card.color,
          border: '1px solid rgba(0,0,0,0.05)',
          borderRadius: 12,
          padding: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 8,
            overflow: 'hidden',
            flexShrink: 0,
            background: 'white'
          }}>
            <img src={card.img} alt={card.title} style={{width:'100%', height:'100%', objectFit:'cover'}} />
          </div>
          
          <div style={{flex: 1}}>
             <div style={{fontSize: 10, color: '#6b7280', textTransform: 'uppercase', fontWeight: 600}}>{card.title}</div>
             <div style={{fontSize: 16, fontWeight: 800, color: '#1f2937', marginBottom: 4}}>{card.subtitle}</div>
             <div style={{fontSize: 14, fontWeight: 700, color: '#059669'}}>From ₹{card.price}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
