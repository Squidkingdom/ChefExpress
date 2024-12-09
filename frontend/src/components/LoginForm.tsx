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

import React, { ChangeEvent, useState } from "react"; // Import React and hooks for state management and event types
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Import icons for showing/hiding password
import { useMutation, QueryClient } from "@tanstack/react-query"; // Import react-query mutation hook and QueryClient for invalidating queries
import { hashPassword } from "../utils/LoginUtil"; // Import a password hashing utility function
import { em } from "framer-motion/client"; // Import 'em' from framer-motion (not used in this code)

/**
 * Interface for the form data fields
 */
interface FormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSuccess: () => void; // Callback to trigger on successful login
}

/**
 * Component: LoginForm
 * Renders a login form with email, password fields, and a login button.
 * Integrates with a login API using react-query for mutations.
 */
const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  // State to store form input values
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  // State to track whether password is visible or hidden
  const [showPassword, setShowPassword] = useState(false);

  // State to store any error messages for form submission
  const [error, setError] = useState("");

  // Handle input changes for form fields (email, password)
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Extract name and value from event target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the corresponding field in formData
    }));
  };

  // Toggle the visibility of the password field
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Define a mutation function using react-query for the login request
  const useLoginMutation = () =>
    useMutation({
      // The mutationFn defines how we perform the async login action
      mutationFn: async (loginData: { email: string; password: string }) => {
        // Hash the password before sending it to the server
        const passwordHash = await hashPassword(loginData.email, loginData.password);

        console.log(`User logging in with passwordHash: ${passwordHash}, password: ${loginData.password}, email: ${loginData.email}`);

        // Make a POST request to our login API endpoint
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: loginData.email,
            pass_hash: passwordHash,
          }),
        });

        // If the response is not ok, throw an error to be caught by onError
        if (!response.ok) {
          throw new Error("Invalid credentials. Please try again.");
        }

        // Parse the JSON response
        const json = await response.json();
        console.log(json);
        return json; // Return the response data (e.g., user token, etc.)
      },
    });

  // Create an instance of our login mutation
  const loginMutation = useLoginMutation();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior (page refresh)

    // Validate that both email and password are provided
    if (!formData.email || !formData.password) {
      setError("Please fill in both fields.");
      return;
    }

    // Clear any previous error
    setError("");

    // Execute the login mutation
    loginMutation.mutate(
      { email: formData.email, password: formData.password },
      {
        onSuccess: (data) => {
          console.log("Login successful:", data);

          // Store the user token and name in localStorage
          localStorage.setItem("token", data.uuid);
          localStorage.setItem("name", data.name);

          // Invalidate certain queries using a new QueryClient to ensure fresh data
          const queryClient = new QueryClient();
          queryClient.invalidateQueries({queryKey: ["savedRecipes", "u_recipes", "ownedRecipes"]});

          // Reload the page to apply changes
          window.location.reload();

          // Call the onSuccess callback passed as a prop
          onSuccess();
        },
        onError: (error: any) => {
          console.error("Login error:", error);
          // Set the error message (if available) or fallback to a generic message
          setError(error.message || "Login failed.");
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-md mx-auto"
    >
      {/* Email Input Field */}
      <div>
        <label className="block text-gray-300 mb-2">Email</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          placeholder="Enter your email"
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          required // Make it a required field
        />
      </div>

      {/* Password Input Field */}
      <div>
        <label className="block text-gray-300 mb-2">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"} // Conditionally show/hide password
            name="password"
            value={formData.password}
            placeholder="Enter your password"
            onChange={handleInputChange}
            className="w-full px-4 py-2 pr-10 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            required // Make it a required field
          />
          {/* Button to toggle password visibility */}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-200 focus:outline-none"
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={20} /> // Eye icon with slash when password is visible
            ) : (
              <AiOutlineEye size={20} /> // Eye icon when password is hidden
            )}
          </button>
        </div>
      </div>

      {/* Display error message if any */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Submit (Login) Button */}
      <button
        type="submit"
        className="w-full bg-teal-500 text-gray-900 py-3 rounded-md font-semibold hover:bg-teal-400 transition duration-200"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm; // Export the component as default
