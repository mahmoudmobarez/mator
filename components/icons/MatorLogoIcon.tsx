
import React from 'react';

interface MatorLogoIconProps {
  className?: string;
}

const MatorLogoIcon: React.FC<MatorLogoIconProps> = ({ className }) => (
  <svg 
    viewBox="0 0 200 50" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="Mator Logo"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#facc15', stopOpacity: 1 }} /> {/* yellow-400 */}
        <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} /> {/* red-500 */}
      </linearGradient>
    </defs>
    <text 
      x="50%" 
      y="50%" 
      dy=".3em" 
      textAnchor="middle" 
      fontSize="38" 
      fontFamily="Arial, sans-serif" 
      fontWeight="bold" 
      fill="url(#logoGradient)"
    >
      MATOR
    </text>
    {/* Simple motorbike silhouette - can be improved */}
    <path d="M10 35 Q15 30 20 35 L25 30 Q30 35 35 30 L40 35 L30 45 Z" fill="#facc15" transform="translate(10, -32) scale(0.5)" />
    <path d="M165 35 Q170 30 175 35 L180 30 Q185 35 190 30 L195 35 L185 45 Z" fill="#ef4444" transform="translate(10, -32) scale(0.5)" />
  </svg>
);

export default MatorLogoIcon;
    