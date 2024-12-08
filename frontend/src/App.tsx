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
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <Router>
      {/* ScrollToTop Component */}
      <ScrollToTop />

      {/* Header Component */}
      <Header setIsLoginOpen={setIsLoginOpen} />

      {/* Login Modal */}
      {isLoginOpen && (
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      )}

      {/* Main Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/make" element={<Make />} />
        <Route path="/order" element={<Order />} />
        <Route path="/share" element={<Share />} />
        {/* 404 Fallback Route */}
        <Route
          path="*"
          element={
            <div className="text-center py-10 text-2xl">Page Not Found</div>
          }
        />
      </Routes>

      {/* Footer Component */}
      <Footer />
    </Router>
  );
}

export default App;
