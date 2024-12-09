/**
 * Name: App.tsx
 * Description:  
 * The main application component for the Chef Express project. It sets up routing, manages global layout, 
 * handles login modal state, and integrates core components like Header, Footer, and ScrollToTop. It defines routes 
 * for various pages like Home, Learn, Make, Order, and Share, and includes a fallback route for unrecognized URLs.
 * 
 * Programmer's name: Darshil, Brady
 * Date the code was created: 11/24/24
 * Date the code was revised: 12/8/24
 * 
 * Preconditions:
 *   - React Router is integrated into the project for navigation.
 *   - State management for login modal visibility is needed.
 * 
 * Acceptable input values or types:
 *   - The `isLoginOpen` state accepts boolean values.
 * 
 * Postconditions:
 *   - The application will display the appropriate pages based on the route.
 *   - The login modal is displayed when `isLoginOpen` is true.
 * 
 * Return values or types:
 *   - Returns a JSX.Element which renders the application layout with routing.
 * 
 * Error and exception condition values:
 *   - No direct error handling in this file, but a 404 route handles invalid paths.
 * 
 * Side effects:
 *   - Updates the UI based on routing and modal state changes.
 * 
 * Invariants:
 *   - The application’s layout structure remains consistent, with Header and Footer components on all pages.
 * 
 * Known faults:
 *   - No known faults identified at this time.
 */

import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Make from "./pages/Make";
import Order from "./pages/Order/OrderPage";
import Share from "./pages/Share";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import ScrollToTop from "./components/ScrollToTop"; // Import ScrollToTop

/**
 * Main application component for setting up routing and layout.
 *
 * @component
 * @returns {JSX.Element} The rendered application component with routing.
 *
 * @example
 * <App />
 */
function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false); // State to manage the visibility of the login modal

  return (
    <Router>
      {/* ScrollToTop Component: Ensures the page scrolls to the top on route change */}
      <ScrollToTop />

      {/* Header Component: Displays the header and passes down state for login modal */}
      <Header setIsLoginOpen={setIsLoginOpen} />

      {/* Login Modal: Conditionally rendered when isLoginOpen is true */}
      {isLoginOpen && (
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      )}

      {/* Main Routes: Defines the application's routing structure */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/make" element={<Make />} />
        <Route path="/order" element={<Order />} />
        <Route path="/share" element={<Share />} />
        {/* 404 Fallback Route: Displays a "Page Not Found" message for invalid routes */}
        <Route
          path="*"
          element={
            <div className="text-center py-10 text-2xl">Page Not Found</div>
          }
        />
      </Routes>

      {/* Footer Component: Displays the footer across all routes */}
      <Footer />
    </Router>
  );
}

export default App;
