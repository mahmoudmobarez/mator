
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SPLASH_DURATION, BRAND_COLORS } from '../constants';
import { useAppContext } from '../contexts/AppContext';
import MatorLogoIcon from './icons/MatorLogoIcon';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/home', { replace: true });
      } else {
        navigate('/auth', { replace: true });
      }
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 animate-fadeIn">
      <MatorLogoIcon className="w-48 h-auto mb-4 animate-pulse" />
      <p className="text-xl font-semibold" style={{color: BRAND_COLORS.primaryYellow}}>Ride with Power</p>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-fadeIn { animation: fadeIn 1s ease-out; }
        .animate-pulse { animation: pulse 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default SplashScreen;
    