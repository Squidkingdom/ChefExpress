import React from 'react';
import Card from '../subcomponents/Card';
import LoginForm from '../components/LoginForm';

/**
 * Login Page
 * The login page for the ChefExpress application
 * @returns {React.JSX.Element} - Login Page
 */
const Login: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-5xl font-extrabold text-center py-6 text-green-600">Welcome to ChefExpress!</h1>
            <Card>
                <div className="max-w-lg mx-auto p-8">
                    <h2 className="text-4xl font-bold text-center text-gray-800 pb-4">Login</h2>
                    <p className="text-center text-gray-600 mb-6">
                        Sign in to access delicious recipes and personalized recommendations.
                    </p>
                    <LoginForm />
                </div>
            </Card>
        </div>
    );
};

export default Login;
