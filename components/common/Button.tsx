
import React from 'react';
import { BRAND_COLORS } from '../../constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', fullWidth = false, children, className, ...props }) => {
  let baseStyle = "px-4 py-2.5 rounded-lg font-semibold text-sm shadow-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
  
  if (fullWidth) {
    baseStyle += " w-full";
  }

  switch (variant) {
    case 'primary': // Yellow
      baseStyle += ` bg-yellow-400 text-slate-900 hover:bg-yellow-500 focus:ring-yellow-500`;
      break;
    case 'secondary': // Darker gray, subtle
      baseStyle += ` bg-slate-700 text-slate-100 hover:bg-slate-600 focus:ring-slate-500`;
      break;
    case 'danger': // Red
      baseStyle += ` bg-red-500 text-white hover:bg-red-600 focus:ring-red-600`;
      break;
    case 'ghost': // Transparent with border
      baseStyle += ` bg-transparent text-yellow-400 border border-yellow-400 hover:bg-yellow-400 hover:text-slate-900 focus:ring-yellow-500`;
      break;
    default:
      baseStyle += ` bg-yellow-400 text-slate-900 hover:bg-yellow-500 focus:ring-yellow-500`;
  }

  return (
    <button className={`${baseStyle} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
    