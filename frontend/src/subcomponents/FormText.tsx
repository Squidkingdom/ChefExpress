/**
 * Name: FormText.tsx
 * Description: This component renders a labeled text input field, supporting both text input and textarea elements. The input field's type is customizable, and the component includes necessary accessibility attributes.
 * Programmer's name: Brady, Darshil
 * Date the code was created: 11/20/24
 * Date the code was revised: 11/24/24
 * Preconditions:
 *   - React must be properly set up in the project.
 *   - The parent component must provide values for the required props (`name`, `value`, `label`, `placeholder`, and `onChange`).
 * Acceptable input values or types:
 *   - `name`: string — The name attribute for the input field (required).
 *   - `value`: string — The current value of the input field (required).
 *   - `label`: string — The label text associated with the input field (required).
 *   - `placeholder`: string — The placeholder text for the input field (required).
 *   - `type`: string (optional) — The type of the input field (defaults to "text").
 *   - `onChange`: function — A callback to handle changes in the input field's value (required).
 * Postconditions:
 *   - Renders a labeled input field with the specified attributes.
 * Return values or types:
 *   - React.JSX.Element — The rendered JSX for the input field with its label.
 * Error and exception condition values:
 *   - None explicitly handled.
 * Side effects:
 *   - None explicitly mentioned.
 * Invariants:
 *   - The input field is always rendered with the given `name`, `value`, `label`, and `placeholder`.
 * Known faults:
 *   - None explicitly mentioned.
 */

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