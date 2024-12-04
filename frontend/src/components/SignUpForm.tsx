import React, { ChangeEvent, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { hashPassword } from "../utils/LoginUtil.tsx";
import { useMutation } from "@tanstack/react-query";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const saltRounds = 10;

interface SignUpFormProps {
  onSuccess: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // anon function for registerAPI
  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; passwordHash: string }) => {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "email": data.email,
          "name": data.name,
          "pass_hash": data.passwordHash,
        }),
      });
      if (!response.ok) throw new Error("Registration failed");
      return response.json();
    },
  });

  // visually track password as its typed
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // toggle function to show password
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };




  // Do things on submit
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

    // Hash and send the password
    try {
      // Conver the Email into bcryptjs compatible b64
      const passwordHash = await 
      hashPassword(email, password)

      // Call the API
      registerMutation.mutate(
        { name, email, passwordHash },
        {
          onSuccess: (data) => {
            // Store login token
            localStorage.setItem("token", data.uuid);
            localStorage.setItem("name", data.name);
            console.log(`User registered with UUID: ${data.uuid}, passwordHash: ${passwordHash}, password: ${password}`);

            // Close the modal
            onSuccess();
            // console.log(passwordHash)
            console.log("User registered successfully");
          },
          onError: (error) => {
            console.log(passwordHash)
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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-md mx-auto"
    >
      {/* name Field */}
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
