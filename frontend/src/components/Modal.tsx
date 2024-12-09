// Modal.tsx
import React, { useEffect } from 'react';
import { FaArrowRight, FaTimes } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string[];
  onNavigate: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  onNavigate,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* X Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Close modal"
        >
          <FaTimes size={24} />
        </button>

        <div className="relative p-8">
          <h3 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-6 pr-8">
            {title}
          </h3>

          <ul className="text-gray-300 text-lg space-y-3 mb-8 list-inside">
            {description.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2.5 mr-3 bg-teal-400 rounded-full" />
                <span className="flex-1">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <button
              type="button"
              onClick={onNavigate}
              className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-400 
                       text-gray-900 rounded-full hover:shadow-lg hover:shadow-teal-500/25 
                       transition-all duration-200 font-medium flex items-center justify-center gap-2 
                       group"
            >
              Go to Page
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-cyan-400/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal-500/10 to-cyan-400/10 blur-2xl" />
      </div>
    </div>
  );
};