/***************************************************************************************************
 * Name of code artifact: index.tsx
 * Brief description of what the code does:
 *   This file defines an Order component that wraps the OrderPage component within an ErrorBoundary 
 *   to catch and display any runtime errors in a user-friendly manner. If an error occurs, it shows 
 *   a styled error message and provides a button to refresh the page.
 * Programmer’s name: Brady
 * Date the code was created: 11/20/24
 * Dates the code was revised: 11/24/24
 * Brief description of each revision & author:
 *   OrderPage component and improved error logging.
 * Preconditions:
 *   - React environment set up.
 *   - OrderPage component must be defined and properly imported.
 * Acceptable and unacceptable input values or types, and their meanings:
 *   - No input values; this component relies on OrderPage and only catches runtime errors.
 * Unacceptable input values or types:
 *   - None, as this is a top-level component without direct inputs.
 * Postconditions:
 *   - If an error is thrown in OrderPage or its children, the ErrorBoundary will display an 
 *     error message and a refresh button.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element).
 * Error and exception condition values or types:
 *   - Any unhandled errors in OrderPage or its descendants trigger the ErrorBoundary’s fallback UI.
 * Side effects:
 *   - Logs errors to the console for debugging.
 * Invariants:
 *   - The fallback UI is displayed only when an error occurs.
 * Any known faults:
 *   - None currently known.
 * Comments summarizing major blocks of code:
 *   - ErrorBoundary class: Catches errors in its children and shows a fallback UI.
 *   - Order component: Wraps the OrderPage in React.StrictMode and ErrorBoundary.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// src/pages/Order.tsx

import React from 'react';
import { motion } from 'framer-motion';
import OrderPage from './OrderPage';

// Interface defining state shape for ErrorBoundary
interface ErrorBoundaryState {
  hasError: boolean;   // Indicates if an error occurred
  error?: Error;       // Holds the error object if present
}

/**
 * ErrorBoundary:
 * A React class component that catches JavaScript errors in its children, logs them, 
 * and displays a fallback UI instead of the crashed part of the UI.
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * getDerivedStateFromError:
   * Lifecycle method called when an error is thrown in a descendant component.
   * Updates state so the next render shows the fallback UI.
   */
  static getDerivedStateFromError(error: Error) {
    console.error('Error caught by boundary:', error);
    return { hasError: true, error };
  }

  /**
   * componentDidCatch:
   * Lifecycle method for logging error details and component stack.
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component Stack:', errorInfo.componentStack);
  }

  /**
   * render:
   * If hasError is true, display a fallback UI with a refresh button.
   * Otherwise, render the children as normal.
   */
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <motion.div 
            className="text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50"
            initial={{ opacity: 0, y: 20 }} // Start hidden and slightly below
            animate={{ opacity: 1, y: 0 }}   // Fade in and rise up
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

    // If no error, just render children
    return this.props.children;
  }
}

/**
 * Order:
 * Functional component wrapping OrderPage with ErrorBoundary.
 * Uses StrictMode to highlight potential issues.
 */
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
