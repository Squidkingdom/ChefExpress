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
