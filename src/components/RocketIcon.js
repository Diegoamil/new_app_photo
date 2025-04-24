import React from 'react';

const RocketIcon = ({ className }) => {
  return (
    <svg 
      className={className} 
      width="80" 
      height="80" 
      viewBox="0 0 80 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M40 8C36.8 8 34 10.8 34 14V34H46V14C46 10.8 43.2 8 40 8Z" 
        fill="#FADB14" 
      />
      <path 
        d="M50 34V24C50 15.2 45.6 8 40 8C34.4 8 30 15.2 30 24V34H26V42L30 46V66C30 68 32 70 34 70H46C48 70 50 68 50 66V46L54 42V34H50Z" 
        fill="#FADB14" 
      />
      <circle 
        cx="40" 
        cy="24" 
        r="4" 
        fill="#1890FF" 
      />
      <path 
        d="M26 42L30 46M54 42L50 46" 
        stroke="#FADB14" 
        strokeWidth="4" 
        strokeLinecap="round" 
      />
    </svg>
  );
};

export default RocketIcon;
