
import React from 'react';
import { BRAND_COLORS } from '../../constants';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, id, icon, className, type = "text", ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
          type={type}
          id={id}
          className={`w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm ${icon ? 'pl-10' : ''} ${className || ''}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
    