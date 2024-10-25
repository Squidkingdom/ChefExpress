import React, { ChangeEvent } from "react";
import FormText from "../subcomponents/FormText";

interface FormData {
    username: string;
    password: string;
}

const LoginForm: React.FC = () => {
    const [formData, setFormData] = React.useState<FormData>({
        username: "",
        password: "",
    });


    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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



