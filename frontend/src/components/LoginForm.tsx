// src/components/LoginForm.tsx

import React, { ChangeEvent, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useMutation, QueryClient} from "@tanstack/react-query";
import { hashPassword } from "../utils/LoginUtil";
import { em } from "framer-motion/client";

/**
 * Interface for the form data
 */
interface FormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSuccess: () => void;
}
/**
 * Component for the login form
 */
const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
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

  //mutator for login
  const useLoginMutation = () =>
    useMutation({
      mutationFn: async (loginData: { email: string; password: string }) => {
        const passwordHash = await hashPassword(loginData.email, loginData.password);
        console.log(`User logging in with passwordHash: ${passwordHash}, password: ${loginData.password}, email: ${loginData.email}`);
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: loginData.email,
            pass_hash: passwordHash,
          }),
        });

        if (!response.ok) {
          throw new Error("Invalid credentials. Please try again.");
        }

        const json = await response.json();
        console.log(json);
        return json; // Assume the response includes a token
      },
    });

  const loginMutation = useLoginMutation();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in both fields.");
      return;
    }


    setError("");

    loginMutation.mutate(
      { email: formData.email, password: formData.password },
      {
        onSuccess: (data) => {
          console.log("Login successful:", data);

          // Example: Store the token and redirect
          localStorage.setItem("token", data.uuid);
          localStorage.setItem("name", data.name);
          const queryClient = new QueryClient();
          queryClient.invalidateQueries({queryKey: ["savedRecipes", "u_recipes", "ownedRecipes"]});
          window.location.reload();
          onSuccess();
        },
        onError: (error) => {
          console.error("Login error:", error);
          setError(error.message || "Login failed.");
        },
      }
    );


  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-md mx-auto"
    >
      {/* email Field */}
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
