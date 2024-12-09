/***************************************************************************************************
 * Name of code artifact: LoginForm.tsx
 * Brief description of what the code does:
 *   This component provides a login form that accepts an email and password, validates input, 
 *   communicates with a backend login endpoint (via a POST request), and stores authentication 
 *   tokens on success. It leverages a React Query mutation to handle the async login process. 
 *   Password hashing is performed before submitting credentials.
 * Programmer’s name: Brady Holland
 * Date the code was created: 11/5/24
 * Dates the code was revised: 11/25/24
 * Brief description of each revision & author:
 *   11/25/24 - Darshil Patel: Integrated password hashing and improved error handling. Added 
 *   toggling of password visibility and better visual feedback for errors.
 * Preconditions:
 *   - React environment and React Query must be properly set up.
 *   - `hashPassword` function should exist to provide hashed credentials.
 *   - Backend API endpoint ("http://localhost:3000/api/login") must be accessible.
 * Acceptable input values or types:
 *   - Email: valid email format (string).
 *   - Password: non-empty string.
 * Unacceptable input values or types:
 *   - Empty email or password fields.
 * Postconditions:
 *   - On successful login, token and user name are stored in localStorage.
 *   - `onSuccess` callback is triggered upon successful login.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element).
 * Error and exception condition values or types:
 *   - If credentials are invalid or network fails, displays error message to the user.
 * Side effects:
 *   - Writes token and user name to localStorage on success.
 * Invariants:
 *   - The form must always have both email and password before submission.
 * Any known faults:
 *   - If the backend URL or schema changes, the login process may fail.
 * Comments summarizing major blocks of code:
 *   - State management: Tracks form input and error states.
 *   - Input handling: Dynamically updates formData state on user input.
 *   - Password visibility toggling: Switches input type and icon.
 *   - useMutation: Handles async login request, including success and error callbacks.
 *   - Form submission: Validates fields, initiates login mutation, handles error states.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// src/components/LoginForm.tsx

import React, { ChangeEvent, useState } from "react";       // Import React, ChangeEvent, useState hook
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Icons for showing/hiding password
import { useMutation } from "@tanstack/react-query";        // useMutation hook from React Query
import { hashPassword } from "../utils/LoginUtil";          // Utility function to hash the password
import { em } from "framer-motion/client";                  // Import 'em' - appears unused

/**
 * Interface for the form data structure
 */
interface FormData {
  email: string;    // User email
  password: string; // User password
}

interface LoginFormProps {
  onSuccess: () => void; // Callback fired on successful login
}

/**
 * Component for the login form
 */
const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  // formData tracks user inputs for email and password
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  // showPassword toggles the visibility of the password input
  const [showPassword, setShowPassword] = useState(false);
  
  // error holds any error message to display to the user
  const [error, setError] = useState("");

  /**
   * Handle input changes for form fields:
   * Updates the corresponding field in formData state on every keystroke.
   * @param {ChangeEvent<HTMLInputElement>} e - The change event from the input
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Extract field name and value
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Toggle password visibility:
   * Switches the input type between "password" and "text".
   */
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  /**
   * useLoginMutation creates a mutation that handles the login process:
   * It sends hashed credentials to the backend and handles the response.
   */
  const useLoginMutation = () =>
    useMutation({
      // mutationFn defines the async login function
      mutationFn: async (loginData: { email: string; password: string }) => {
        // Hash the password with the email
        const passwordHash = await hashPassword(loginData.email, loginData.password);
        console.log(`User logging in with passwordHash: ${passwordHash}, password: ${loginData.password}, email: ${loginData.email}`);
        
        // Send POST request to the login endpoint
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: loginData.email,
            pass_hash: passwordHash,
          }),
        });

        // If response is not ok, throw an error to be caught by onError callback
        if (!response.ok) {
          throw new Error("Invalid credentials. Please try again.");
        }

        // Parse JSON response, expected to include token and user info
        const json = await response.json();
        console.log(json);
        return json;
      },
    });

  // Initialize the login mutation
  const loginMutation = useLoginMutation();

  /**
   * Handle form submission:
   * Checks for empty fields, then triggers the login mutation.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default page refresh

    // Validate that both email and password are provided
    if (!formData.email || !formData.password) {
      setError("Please fill in both fields.");
      return;
    }

    setError(""); // Clear any previous errors

    // Mutate with provided credentials
    loginMutation.mutate(
      { email: formData.email, password: formData.password },
      {
        // onSuccess callback fires if login is successful
        onSuccess: (data) => {
          console.log("Login successful:", data);

          // Store token and name in localStorage for future sessions
          localStorage.setItem("token", data.uuid);
          localStorage.setItem("name", data.name);

          // Call onSuccess callback to proceed further (e.g., close modal or redirect)
          onSuccess();
        },
        // onError callback fires if login fails
        onError: (error: any) => {
          console.error("Login error:", error);
          // Display the error message if available, or a generic message
          setError(error.message || "Login failed.");
        },
      }
    );
  };

  // Render the form
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-md mx-auto"
    >
      {/* Email Field */}
      <div>
        <label className="block text-gray-300 mb-2">Email</label>
        <input
          type="text"
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
            type={showPassword ? "text" : "password"}   // Conditionally show password text
            name="password"
            value={formData.password}
            placeholder="Enter your password"
            onChange={handleInputChange}
            className="w-full px-4 py-2 pr-10 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
          {/* Toggle password visibility button */}
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

      {/* Error Message: Display only if error is set */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-teal-500 text-gray-900 py-3 rounded-md font-semibold hover:bg-teal-400 transition duration-200"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
