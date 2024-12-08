import React from 'react';
import { motion } from 'framer-motion';
import OrderPage from './OrderPage';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Error caught by boundary:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component Stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <motion.div 
            className="text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 
                          bg-clip-text text-transparent mb-4">
              Oops! Something went wrong
            </h2>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-400 
                       text-gray-900 rounded-xl font-medium"
            >
              Refresh Page
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Order = () => {
  console.log('Rendering Order component'); // Debug log
  
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <OrderPage />
      </ErrorBoundary>
    </React.StrictMode>
  );
};

export default Order;