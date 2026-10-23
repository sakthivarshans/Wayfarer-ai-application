import React from 'react';

interface ToucanLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export function ToucanLogo({ size = 'md', showWordmark = true, className = '' }: ToucanLogoProps) {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-lg' },
    md: { icon: 'w-8 h-8', text: 'text-xl' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl' }
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Geometric Toucan Mark */}
      <svg
        className={`${sizeMap[size].icon} shrink-0 text-[#6D28D9]`}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Wayfarer Toucan Logo"
      >
        <circle cx="20" cy="20" r="18" fill="#F5F3FF" stroke="#EDE9FE" strokeWidth="1.5" />
        {/* Toucan body & chest */}
        <path
          d="M14 28C14 28 15 17 21 14C23.5 12.8 26 13 28 14C24 16 22 20 22 24C22 26 21 28 19 28H14Z"
          fill="#1F1637"
        />
        {/* Toucan large graceful curved beak */}
        <path
          d="M21 14C24 11 28.5 10 33 12C31.5 15.5 28 17.5 24 18C22.5 18 21.5 17 21 14Z"
          fill="#6D28D9"
        />
        {/* Beak accent tip */}
        <path
          d="M28 11.5C30.5 11 32.5 11.5 33 12C32 14.5 30 16 28 16.5C28.8 14.5 28.8 13 28 11.5Z"
          fill="#8B5CF6"
        />
        {/* Eye */}
        <circle cx="19" cy="16" r="1.5" fill="#FFFFFF" />
        <circle cx="19" cy="16" r="0.75" fill="#1F1637" />
      </svg>

      {showWordmark && (
        <span className={`font-heading font-bold ${sizeMap[size].text} tracking-tight text-[#1F1637] whitespace-nowrap`}>
          Wayfarer<span className="text-[#6D28D9]">.</span>
        </span>
      )}
    </div>
  );
}
