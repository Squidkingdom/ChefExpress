/***************************************************************************************************
 * Name of code artifact: LoginModal.tsx
 * Brief description of what the code does:
 *   This component renders a modal window that allows the user to either log in or sign up to 
 *   the ChefExpress application. It conditionally displays either a LoginForm or a SignUpForm, 
 *   and includes logic for toggling between these two states. The modal can be closed by clicking 
 *   the close button or by invoking the provided onClose callback.
 * Programmer’s name: Programmer 1
 * Date the code was created: Date 1
 * Dates the code was revised: Date 2
 * Brief description of each revision & author:
 *   Date 2 - Programmer 1: Integrated SignUpForm and toggling feature to switch between Login and 
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

import React, { useState } from "react";     // Import React and useState hook
import LoginForm from "../components/LoginForm"; // Import LoginForm for login functionality
import SignUpForm from "../components/SignUpForm"; // Import SignUpForm for sign-up functionality

// Interface defining props for the LoginModal
interface LoginModalProps {
  isOpen: boolean;  // Determines if the modal should be visible
  onClose: () => void; // Function to close the modal
}

/**
 * Login Modal
 * A reusable login modal for the ChefExpress application.
 * Now includes the option to sign up, toggled by internal state.
 */
const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  // State to switch between Login form and Sign-up form
  const [isSignUp, setIsSignUp] = useState(false);

  // If modal is not open, return null to prevent rendering
  if (!isOpen) return null;

  return (
    // Background overlay with semi-transparent black to focus attention on modal
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-full max-w-md mx-auto p-6 rounded-lg shadow-lg relative">
        {/* Close Button positioned at top-right corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold focus:outline-none"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Modal Content */}
        <div>
          {/* Heading: changes text based on isSignUp state */}
          <h2 className="text-3xl font-bold text-center text-teal-400 pb-4">
            {isSignUp ? "Sign Up" : "Login"}
          </h2>

          {/* Subheading message: differ for Sign Up vs Login */}
          <p className="text-center text-gray-300 mb-6">
            {isSignUp
              ? "Create an account to access delicious recipes and personalized recommendations."
              : "Sign in to access delicious recipes and personalized recommendations."}
          </p>

          {/* Conditionally render either the SignUpForm or LoginForm based on isSignUp */}
          {isSignUp ? <SignUpForm onSuccess={onClose} /> : <LoginForm onSuccess={onClose} />}

          {/* Toggle between Login and Sign Up forms */}
          <div className="text-center mt-6">
            {isSignUp ? (
              // If currently on Sign Up, provide a link to switch to Login
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
              // If currently on Login, provide a link to switch to Sign Up
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

// Export the LoginModal component as default for use in other parts of the application
export default LoginModal;


// // src/components/LoginModal.tsx

// import React, { useState } from "react";
// import LoginForm from "../components/LoginForm";
// import SignUpForm from "../components/SignUpForm"; // Import the SignUpForm component

// interface LoginModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// /**
//  * Login Modal
//  * A reusable login modal for the ChefExpress application.
//  * Now includes the option to sign up.
//  */
// const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
//   const [isSignUp, setIsSignUp] = useState(false); // State to toggle between login and sign-up forms

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
//       <div className="bg-gray-800 w-full max-w-md mx-auto p-6 rounded-lg shadow-lg relative">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold focus:outline-none"
//           aria-label="Close modal"
//         >
//           &times;
//         </button>
//         {/* Modal Content */}
//         <div>
//           <h2 className="text-3xl font-bold text-center text-teal-400 pb-4">
//             {isSignUp ? "Sign Up" : "Login"}
//           </h2>
//           <p className="text-center text-gray-300 mb-6">
//             {isSignUp
//               ? "Create an account to access delicious recipes and personalized recommendations."
//               : "Sign in to access delicious recipes and personalized recommendations."}
//           </p>
//           {/* Render the appropriate form */}
//           {isSignUp ? <SignUpForm onSuccess={onClose}/> : <LoginForm onSuccess={onClose} />}
//           {/* Toggle between Login and Sign Up */}
//           <div className="text-center mt-6">
//             {isSignUp ? (
//               <p className="text-gray-300">
//                 Already have an account?{" "}
//                 <button
//                   onClick={() => setIsSignUp(false)}
//                   className="text-teal-400 hover:underline focus:outline-none"
//                 >
//                   Login here
//                 </button>
//               </p>
//             ) : (
//               <p className="text-gray-300">
//                 Don't have an account?{" "}
//                 <button
//                   onClick={() => setIsSignUp(true)}
//                   className="text-teal-400 hover:underline focus:outline-none"
//                 >
//                   Sign up here
//                 </button>
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginModal;
