import React from 'react';
import Card from '../subcomponents/Card';
import LoginForm from '../components/LoginForm';

/**
 * Login Page
 * The login page for the application
 * @returns {React.JSX.Element} - Login Page
 */
const Login: React.FC = () => {
    return (
        <div>
            <h1 className='text-4xl font-bold text-center py-6'>Welcome to ChefExpress!</h1>
            <Card>
                <div className='max-w-xl mx-auto px-8'>
                    <div className="text-4xl font-bold text-center pb-5 pt-8">Login</div>
                    <LoginForm />
                </div>
            </Card>
        </div>

    );
};

export default Login;