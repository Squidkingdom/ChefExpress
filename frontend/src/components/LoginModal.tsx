/***************************************************************************************************
 * Name of code artifact: LoginModal.tsx
 * Brief description of what the code does:
 *   This component renders a modal window that allows the user to either log in or sign up to 
 *   the ChefExpress application. It conditionally displays either a LoginForm or a SignUpForm, 
 *   and includes logic for toggling between these two states. The modal can be closed by clicking 
 *   the close button or by invoking the provided onClose callback.
 * Programmer’s name: Darshil Patel
 * Date the code was created: 11/6/24
 * Dates the code was revised: 11/15/24
 * Brief description of each revision & author:
 *   11/15/24 - Brady Holland: Integrated SignUpForm and toggling feature to switch between Login and 
 *   SignUp modes.
 * Preconditions:
 *   - Must be used within a React environment.
 *   - LoginForm and SignUpForm must be implemented and imported correctly.
 *   - `isOpen` determines if the modal should be visible.
 * Acceptable input values or types:
 *   - `isOpen`: boolean indicating whether the modal is open.
 *   - `onClose`: a function to close the modal.
 * Unacceptable input values or types:
 *   - Non-boolean for `isOpen`.
 *   - Non-function for `onClose`.
 * Postconditions:
 *   - Renders a modal overlay if `isOpen` is true.
 *   - Shows either Login or SignUp form based on `isSignUp` state.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element or null if closed).
 * Error and exception condition values or types:
 *   - If required components are missing, the modal may fail to render the intended forms.
 * Side effects:
 *   - None, aside from DOM updates.
 * Invariants:
 *   - The modal's internal state toggles between showing LoginForm and SignUpForm.
 * Any known faults:
 *   - If `onSuccess` from forms doesn't handle navigation or modal closure correctly, modal may remain open.
 * Comments summarizing major blocks of code:
 *   - State `isSignUp`: toggles between login and sign-up modes.
 *   - Conditional rendering: if `isSignUp` is true, show SignUpForm; otherwise, LoginForm.
 *   - Buttons to toggle form state and close the modal.
 * Comments on every line are provided below.
 ***************************************************************************************************/


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
