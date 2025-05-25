
import React from 'react';

interface PageWrapperProps {
  title?: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void; // Custom back action
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, children, showBackButton, onBack }) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20 pt-4 px-4"> {/* pb-20 for navbar, pt-4 for top spacing, px-4 for side */}
      {(title || showBackButton) && (
        <div className="flex items-center mb-6">
          {showBackButton && (
            <button onClick={handleBack} className="mr-3 p-2 rounded-full hover:bg-slate-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}
          {title && <h1 className="text-3xl font-bold text-yellow-400">{title}</h1>}
        </div>
      )}
      <div className="animate-fadeInUp">
        {children}
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default PageWrapper;
    