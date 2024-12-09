/***************************************************************************************************
 * Name of code artifact: SignUpForm.tsx
 * Brief description of what the code does:
 *   This component provides a user registration form that collects the user's name, email, and 
 *   password. It validates the inputs (including matching passwords) and attempts to register 
 *   the user by sending hashed password credentials to the backend API. On successful registration, 
 *   it stores the user's token and name in localStorage and triggers an onSuccess callback, 
 *   typically closing a modal or moving to the next step.
 * Programmer’s name: Programmer 1
 * Date the code was created: Date 1
 * Dates the code was revised: Date 2
 * Brief description of each revision & author:
 *   Date 2 - Programmer 1: Integrated password hashing, added password visibility toggle, and 
 *   implemented form validation and error handling.
 * Preconditions:
 *   - React environment must be set up.
 *   - React Query and a hashing function (hashPassword) must be available.
 *   - A backend endpoint `http://localhost:3000/api/register` that accepts POST requests with 
 *     email, name, and pass_hash fields must be running.
 * Acceptable and unacceptable input values or types, and their meanings:
 *   - name, email, password, confirmPassword: all must be non-empty strings.
 *   - email must be a valid email format (enforced by the `type="email"` input).
 *   - password and confirmPassword must match.
 * Unacceptable inputs:
 *   - Empty fields or non-matching passwords will block submission and display an error message.
 * Postconditions:
 *   - On success, stores user token and name in localStorage, calls onSuccess callback.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element).
 * Error and exception condition values or types:
 *   - If registration fails or hashing fails, displays an error message to the user.
 * Side effects:
 *   - Writes token and name to localStorage on successful registration.
 * Invariants:
 *   - Always validates password confirmation and requires all fields before submission.
 * Any known faults:
 *   - If the backend URL or schema changes, the form may fail to register the user.
 * Comments summarizing major blocks of code:
 *   - State management: Tracks form inputs, error messages, and password visibility.
 *   - Validation: Checks if fields are filled and if passwords match before sending data.
 *   - Registration mutation: Uses React Query’s `useMutation` to send registration data to the server.
 *   - On success: Saves token and name, calls onSuccess.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// Import React and hooks
import React, { ChangeEvent, useState } from "react";
// Icons for password visibility toggle
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// hashPassword utility function for password hashing
import { hashPassword } from "../utils/LoginUtil.tsx";
// useMutation hook from React Query for async form submission
import { useMutation } from "@tanstack/react-query";

// Interface for the form data structure
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Props for SignUpForm
interface SignUpFormProps {
  onSuccess: () => void; // Called upon successful registration
}

/**
 * SignUpForm component:
 * Renders a registration form. On submit, validates the input, hashes the password,
 * sends the data to the registration endpoint, and upon success, stores credentials and calls onSuccess.
 */
const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess }) => {
  // State for form fields
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State controlling password visibility in the form
  const [showPassword, setShowPassword] = useState(false);

  // State for error messages displayed to the user
  const [error, setError] = useState("");

  /**
   * registerMutation:
   * Defines a mutation that sends registration data to the backend and handles success/error states.
   */
  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; passwordHash: string }) => {
      // POST request to registration endpoint
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "email": data.email,
          "name": data.name,
          "pass_hash": data.passwordHash,
        }),
      });
      // Throw error if response is not ok
      if (!response.ok) throw new Error("Registration failed");
      // Parse and return JSON
      return response.json();
    },
  });

  /**
   * handleInputChange:
   * Updates the corresponding field in formData state whenever an input changes.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * togglePasswordVisibility:
   * Toggles whether passwords are visible in text form or obscured.
   */
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  /**
   * handleSubmit:
   * Validates the form fields, hashes the password, and attempts registration via registerMutation.
   * On success, stores token and name in localStorage and calls onSuccess.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    // Check if all fields are filled
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Attempt to hash the password and send registration data
    try {
      // Hash the password using user email and password
      const passwordHash = await hashPassword(email, password);

      // Perform the registration mutation
      registerMutation.mutate(
        { name, email, passwordHash },
        {
          onSuccess: (data) => {
            // On success, store token and user name in localStorage
            localStorage.setItem("token", data.uuid);
            localStorage.setItem("name", data.name);
            console.log(`User registered with UUID: ${data.uuid}, passwordHash: ${passwordHash}, password: ${password}`);

            // Close the modal or proceed with the app flow
            onSuccess();
            console.log("User registered successfully");
          },
          onError: (error) => {
            console.error(error);
            setError("Registration failed. Please try again.");
          },
        }
      );

      setError("");
    } catch (err) {
      console.error("Error hashing password:", err);
      setError("An error occurred. Please try again.");
    }
  };

  // Render the sign-up form
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-md mx-auto"
    >
      {/* Name Field */}
      <div>
        <label className="block text-gray-300 mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Enter your name"
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-gray-300 mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Enter your email"
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-gray-300 mb-2">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            placeholder="Create a password"
            onChange={handleInputChange}
            className="w-full px-4 py-2 pr-10 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-200 focus:outline-none"
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label className="block text-gray-300 mb-2">Confirm Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirm your password"
            onChange={handleInputChange}
            className="w-full px-4 py-2 pr-10 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-200 focus:outline-none"
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-teal-500 text-gray-900 py-3 rounded-md font-semibold hover:bg-teal-400 transition duration-200"
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;


// import React, { ChangeEvent, useState } from "react";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { hashPassword } from "../utils/LoginUtil.tsx";
// import { useMutation } from "@tanstack/react-query";

// interface FormData {
//   name: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

// interface SignUpFormProps {
//   onSuccess: () => void;
// }

// const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess }) => {
//   const [formData, setFormData] = useState<FormData>({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   // anon function for registerAPI
//   const registerMutation = useMutation({
//     mutationFn: async (data: { name: string; email: string; passwordHash: string }) => {
//       const response = await fetch("http://localhost:3000/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           "email": data.email,
//           "name": data.name,
//           "pass_hash": data.passwordHash,
//         }),
//       });
//       if (!response.ok) throw new Error("Registration failed");
//       return response.json();
//     },
//   });

//   // visually track password as its typed
//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // toggle function to show password
//   const togglePasswordVisibility = () => {
//     setShowPassword((prevState) => !prevState);
//   };




//   // Do things on submit
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

//     e.preventDefault();
//     const { name, email, password, confirmPassword } = formData;

//     // Check if all fields are filled
//     if (!name || !email || !password || !confirmPassword) {
//       setError("Please fill in all fields.");
//       return;
//     }
//     // Check if passwords match
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     // Hash and send the password
//     try {
//       // Conver the Email into bcryptjs compatible b64
//       const passwordHash = await 
//       hashPassword(email, password)

//       // Call the API
//       registerMutation.mutate(
//         { name, email, passwordHash },
//         {
//           onSuccess: (data) => {
//             // Store login token
//             localStorage.setItem("token", data.uuid);
//             localStorage.setItem("name", data.name);
//             console.log(`User registered with UUID: ${data.uuid}, passwordHash: ${passwordHash}, password: ${password}`);

//             // Close the modal
//             onSuccess();
//             // console.log(passwordHash)
//             console.log("User registered successfully");
//           },
//           onError: (error) => {
//             console.log(passwordHash)
//             console.error(error);
//             setError("Registration failed. Please try again.");
//           },
//         }
//       );

//       setError("");
//     } catch (err) {
//       console.error("Error hashing password:", err);
//       setError("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-6 w-full max-w-md mx-auto"
//     >
//       {/* name Field */}
//       <div>
//         <label className="block text-gray-300 mb-2">Name</label>
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           placeholder="Enter your name"
//           onChange={handleInputChange}
//           className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//           required
//         />
//       </div>

//       {/* Email Field */}
//       <div>
//         <label className="block text-gray-300 mb-2">Email</label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           placeholder="Enter your email"
//           onChange={handleInputChange}
//           className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//           required
//         />
//       </div>

//       {/* Password Field */}
//       <div>
//         <label className="block text-gray-300 mb-2">Password</label>
//         <div className="relative">
//           <input
//             type={showPassword ? "text" : "password"}
//             name="password"
//             value={formData.password}
//             placeholder="Create a password"
//             onChange={handleInputChange}
//             className="w-full px-4 py-2 pr-10 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//             required
//           />
//           <button
//             type="button"
//             onClick={togglePasswordVisibility}
//             className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-200 focus:outline-none"
//             aria-label="Toggle password visibility"
//           >
//             {showPassword ? (
//               <AiOutlineEyeInvisible size={20} />
//             ) : (
//               <AiOutlineEye size={20} />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Confirm Password Field */}
//       <div>
//         <label className="block text-gray-300 mb-2">Confirm Password</label>
//         <div className="relative">
//           <input
//             type={showPassword ? "text" : "password"}
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             placeholder="Confirm your password"
//             onChange={handleInputChange}
//             className="w-full px-4 py-2 pr-10 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//             required
//           />
//           <button
//             type="button"
//             onClick={togglePasswordVisibility}
//             className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-200 focus:outline-none"
//             aria-label="Toggle password visibility"
//           >
//             {showPassword ? (
//               <AiOutlineEyeInvisible size={20} />
//             ) : (
//               <AiOutlineEye size={20} />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && <p className="text-red-500 text-sm">{error}</p>}

//       {/* Submit Button */}
//       <button
//         type="submit"
//         className="w-full bg-teal-500 text-gray-900 py-3 rounded-md font-semibold hover:bg-teal-400 transition duration-200"
//       >
//         Sign Up
//       </button>
//     </form>
//   );
// };

// export default SignUpForm;
