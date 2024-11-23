// src/App.tsx

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Page Components
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Make from "./pages/Make";
import Order from "./pages/Order";
// Removed Share import

// Shared Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import GuidedTour from "./components/GuidedTour";
import LoginModal from "./components/LoginModal";

/**
 * Main application component for setting up routing and layout.
 *
 * This component uses React Router to navigate between different pages,
 * rendering the appropriate component based on the URL path. Includes
 * a persistent Header and Footer across all routes.
 *
 * @component
 * @returns {JSX.Element} The rendered application component with routing.
 *
 * @example
 * <App />
 */
function App() {
  const [runTour, setRunTour] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
        {/* Fixed Header */}
        <Header setIsLoginOpen={setIsLoginOpen} />

        {/* Guided Tour */}
        <GuidedTour
          runTour={runTour}
          setRunTour={setRunTour}
          setIsLoginOpen={setIsLoginOpen}
        />

        {/* Login Modal */}
        {isLoginOpen && (
          <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-grow relative">
          <Routes>
            <Route path="/" element={<Home setRunTour={setRunTour} />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/make/*" element={<Make />} />
            <Route path="/order/*" element={<Order />} />
            {/* Removed Share Route */}
            {/* Optional: Redirect any unknown routes to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName="bg-gray-800/90 backdrop-blur-sm text-gray-100 rounded-xl"
        />
      </div>
    </Router>
  );
}

export default App;
