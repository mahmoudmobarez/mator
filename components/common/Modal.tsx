
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void; // Optional: if provided, shows a close button
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-yellow-400">{title}</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-200"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
    