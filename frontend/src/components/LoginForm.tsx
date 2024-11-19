// src/components/LoginForm.tsx

import React, { ChangeEvent, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

/**
 * Interface for the form data
 */
interface FormData {
  username: string;
  password: string;
}

/**
 * Component for the login form
 */
const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
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
    if (!formData.username || !formData.password) {
      setError("Please fill in both fields.");
      return;
    }
    setError("");
    // Handle login logic
    console.log("Logging in with:", formData);
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
          placeholder="Enter your username"
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
            placeholder="Enter your password"
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
        Login
      </button>
    </form>
  );
};

export default LoginForm;
