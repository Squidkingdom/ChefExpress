// src/components/SignUpForm.tsx

import React, { ChangeEvent, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

/**
 * Interface for the form data
 */
interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Component for the sign-up form
 */
const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes for form fields
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Additional validation can be added here (e.g., password strength)

    setError("");
    // Handle sign-up logic
    console.log("Signing up with:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-md mx-auto"
    >
      {/* Username Field */}
      <div>
        <label className="block text-gray-300 mb-2">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          placeholder="Choose a username"
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
