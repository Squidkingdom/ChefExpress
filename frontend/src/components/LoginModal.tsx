// src/components/LoginModal.tsx

import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Login Modal
 * A reusable login modal with improved design aesthetics.
 */
const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-md mx-4 sm:mx-auto">
        <div className="relative bg-gray-900/80 backdrop-blur-md border border-gray-700 
                        rounded-2xl shadow-2xl p-8 pt-12 overflow-hidden">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br 
                          from-teal-500/30 via-cyan-500/30 to-purple-500/30 
                          opacity-50 pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold focus:outline-none transition-colors"
            aria-label="Close modal"
          >
            &times;
          </button>

          {/* Modal Content */}
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent pb-4">
              {isSignUp ? "Sign Up" : "Login"}
            </h2>
            <p className="text-center text-gray-300 mb-6 leading-relaxed">
              {isSignUp
                ? "Create an account to access delicious recipes and personalized recommendations."
                : "Sign in to access delicious recipes and personalized recommendations."}
            </p>

            {/* Appropriate Form */}
            <div className="mb-6">
              {isSignUp ? (
                <SignUpForm onSuccess={onClose} />
              ) : (
                <LoginForm onSuccess={onClose} />
              )}
            </div>

            {/* Toggle Login/Sign Up */}
            <div className="text-center mt-6">
              {isSignUp ? (
                <p className="text-gray-300">
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsSignUp(false)}
                    className="text-teal-400 hover:text-teal-300 hover:underline focus:outline-none transition-colors duration-200"
                  >
                    Login here
                  </button>
                </p>
              ) : (
                <p className="text-gray-300">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setIsSignUp(true)}
                    className="text-teal-400 hover:text-teal-300 hover:underline focus:outline-none transition-colors duration-200"
                  >
                    Sign up here
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
