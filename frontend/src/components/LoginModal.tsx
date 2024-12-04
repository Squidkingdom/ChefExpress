// src/components/LoginModal.tsx

import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm"; // Import the SignUpForm component

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Login Modal
 * A reusable login modal for the ChefExpress application.
 * Now includes the option to sign up.
 */
const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle between login and sign-up forms

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-full max-w-md mx-auto p-6 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold focus:outline-none"
          aria-label="Close modal"
        >
          &times;
        </button>
        {/* Modal Content */}
        <div>
          <h2 className="text-3xl font-bold text-center text-teal-400 pb-4">
            {isSignUp ? "Sign Up" : "Login"}
          </h2>
          <p className="text-center text-gray-300 mb-6">
            {isSignUp
              ? "Create an account to access delicious recipes and personalized recommendations."
              : "Sign in to access delicious recipes and personalized recommendations."}
          </p>
          {/* Render the appropriate form */}
          {isSignUp ? <SignUpForm onSuccess={onClose}/> : <LoginForm />}
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
      </div>
    </div>
  );
};

export default LoginModal;
