import React, { ChangeEvent, useState } from "react";
import FormText from "../subcomponents/FormText";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

/**
 * Interface for the form data
 *
 * @interface FormData
 */
interface FormData {
    username: string;
    password: string;
}

/**
 * Component for the login form
 *
 * @returns {React.JSX.Element} - The login form
 */
const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    // Handle input changes for form fields
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        console.log(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-md p-6 bg-white rounded-lg shadow-lg space-y-4">
            <FormText
                name="username"
                value={formData.username}
                label="Username"
                placeholder="Enter your username"
                onChange={handleInputChange}
            />

            <div className="relative w-full">
                <FormText
                    name="password"
                    value={formData.password}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    onChange={handleInputChange}
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label="Toggle password visibility"
                >
                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" className="bg-primary text-white py-2 px-4 rounded-lg w-full hover:bg-opacity-90 transition duration-200">
                Submit
            </button>
        </form>
    );
};

export default LoginForm;
