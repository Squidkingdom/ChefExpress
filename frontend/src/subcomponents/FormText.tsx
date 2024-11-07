import React, { ChangeEvent } from "react";

interface FormTextProps {
    name: string;
    value: string;
    label: string;
    placeholder: string;
    type?: string; // Make type optional
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

/**
 * FormText component for rendering a labeled text input field.
 *
 * @param {FormTextProps} props - The properties required by the component.
 * @returns {React.JSX.Element} - The rendered input field with label.
 */
const FormText: React.FC<FormTextProps> = ({ name, value, label, placeholder, type = "text", onChange }) => {
    return (
        <div className="flex flex-col mb-6 w-full">
            <label htmlFor={name} className="text-sm font-semibold text-gray-700 mb-2">
                {label}
            </label>
            <input
                type={type} // Use the type prop here
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 transition duration-200"
            />
        </div>
    );
};

export default FormText;
