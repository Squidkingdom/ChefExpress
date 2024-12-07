import React from 'react';
import OrderPage from './OrderPage';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl text-red-400 mb-4">
              Something went wrong loading the order page.
            </h2>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Order = () => {
  return (
    <div>
      <ErrorBoundary>
        <OrderPage />
      </ErrorBoundary>
    </div>
  );
};

export default Order;