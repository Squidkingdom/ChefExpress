import React, { ChangeEvent } from "react";

const FormText: React.FC<{
    name: string; 
    value: string;
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void}> = ({name, value, label, placeholder, onChange}) => {
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
