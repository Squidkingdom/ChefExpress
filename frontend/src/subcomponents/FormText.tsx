/**
 * FormText component for rendering a labeled text input field.
 *
 * This component displays a text input with an associated label, and handles
 * input changes via a callback function. It supports custom placeholder text
 * and label display for a streamlined form experience.
 *
 * @param {FormTextProps} props - The properties required by the component.
 * @param {string} props.name - Internal name attribute of the input field.
 * @param {string} props.value - Current value of the input field.
 * @param {string} props.label - Label text displayed above the input.
 * @param {string} props.placeholder - Placeholder text for the input.
 * @param {(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} props.onChange - Function called on input change.
 * @returns {React.JSX.Element} The rendered input field with label.
 *
 * @example
 * <FormText
 *   name="username"
 *   value={username}
 *   label="Username"
 *   placeholder="Enter your username"
 *   onChange={handleInputChange}
 * />
 */

import React, { ChangeEvent } from "react";

/**
 * Description placeholder
 *
 * @interface FormTextProps
 * @typedef {FormTextProps}
 */
interface FormTextProps {
    /**
     * Name of the form input (internal)
     *
     * @type {string}
     */
    name: string; 
    /**
     * Current value of the input
     *
     * @type {string}
     */
    value: string;
    /**
     * The displayed label for the input (external name)
     *
     * @type {string}
     */
    label: string;
    /**
     * Placeholder to be shown when the input is empty
     *
     * @type {string}
     */
    placeholder: string;
    /**
     * Function to handle input change
     *
     * @type {(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void}
     */
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}


/**
 * Entire FormText component implementing text inputs
 *
 * @param {FormTextProps} prop
 * @param {string} prop.name
 * @param {string} prop.value
 * @param {string} prop.label
 * @param {string} prop.placeholder
 * @param {(ChangeEvent) => void} prop.onChange
 * @returns {React.JSX.Element}
 */
const FormText: React.FC<FormTextProps> = ({name, value, label, placeholder, onChange}) => {
    return (
        <div className="flex flex-col pb-5 w-1/2">
                <label className="font-bold mb-1" htmlFor={name}>{label}</label>
                <input className="border border-gray-400 rounded-md p-1"
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                >
                </input>
        </div>
    );
};

export default FormText;
