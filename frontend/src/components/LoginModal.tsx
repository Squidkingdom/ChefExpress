import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800/80 backdrop-blur-lg w-full max-w-md mx-auto p-6 rounded-2xl shadow-lg relative"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 focus:outline-none"
              aria-label="Close modal"
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div>
              <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                {isSignUp ? "Sign Up" : "Login"}
              </h2>

              {/* Render the appropriate form */}
              {isSignUp ? <SignUpForm /> : <LoginForm />}

              {/* Toggle between Login and Sign Up */}
              <div className="text-center mt-6">
                {isSignUp ? (
                  <p className="text-gray-300">
                    Already have an account?{" "}
                    <button
                      onClick={() => setIsSignUp(false)}
                      className="text-teal-400 hover:underline focus:outline-none"
                    >
                      Login here
                    </button>
                  </p>
                ) : (
                  <p className="text-gray-300">
                    Don't have an account?{" "}
                    <button
                      onClick={() => setIsSignUp(true)}
                      className="text-teal-400 hover:underline focus:outline-none"
                    >
                      Sign up here
                    </button>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;