import React, { ChangeEvent } from "react";
import FormText from "../subcomponents/FormText";

/**
 * Interface for the form
 *
 * @interface FormData
 * @typedef {FormData}
 */
interface FormData {
    /**
     * The username typed into the box
     *
     * @param {string} username - The username input box
     * @param {string} password - The password input box
     */
    username: string;
    password: string;
}

/**
 * Component for the login form
 *
 * @returns {React.JSX.Element} - The login form
 */
const LoginForm: React.FC = () => {
    // Create a state for the form data using FormData interface
    const [formData, setFormData] = React.useState<FormData>({
        username: "",
        password: "",
    });

    // Function that handles the input change (on key press while in box)
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target; // Get the name and new value of the input that changed
        // Set the form data to the previous data and update the changed value
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

    // Function that handles the form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Do API call here
        console.log(formData);
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <FormText
                name="username"
                value={formData.username}
                label="Username"
                placeholder="user"
                onChange={handleInputChange} />

            <FormText
                name="password"
                value={formData.password}
                label="Password"
                placeholder="pass"
                onChange={handleInputChange} />
            <button className="bg-gray-800 text-white p-2 rounded-md w-1/2">Submit</button>
        </form>
    );
}

export default LoginForm;



