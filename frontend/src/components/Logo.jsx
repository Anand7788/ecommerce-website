import React from 'react';

export default function Logo({ width = 40, height = 40, className = '' }) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f093fb" />
          <stop offset="100%" stopColor="#f5576c" />
        </linearGradient>
      </defs>
      
      {/* S Shape with Gradient */}
      <path 
        d="M30 65C30 75 40 80 50 80C65 80 70 65 60 55L40 45C30 35 35 20 50 20C60 20 70 25 70 35" 
        stroke="url(#brandGradient)" 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="logo-path"
      />
      
      {/* Dot with same gradient fill */}
      <circle 
        cx="65" 
        cy="35" 
        r="7" 
        fill="url(#brandGradient)"
        className="logo-dot"
      />

       <style>
        {`
          .logo-path {
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
            animation: drawLine 2s ease-out forwards;
          }
          .logo-dot {
            animation: pulseDot 2s infinite;
          }
          
          @keyframes drawLine {
            to { stroke-dashoffset: 0; }
          }
          @keyframes pulseDot {
             0%, 100% { transform: scale(1); opacity: 1; }
             50% { transform: scale(1.2); opacity: 0.8; }
          }
        `}
      </style>
    </svg>
  );
}
