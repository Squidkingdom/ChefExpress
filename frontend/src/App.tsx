/**
 * Main application component for setting up routing and layout.
 *
 * This component uses React Router to navigate between different pages,
 * rendering the appropriate component based on the URL path. Includes
 * a persistent Header across all routes.
 *
 * @component
 * @returns {JSX.Element} The rendered application component with routing.
 *
 * @example
 * <App />
 */

// App.tsx

import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Make from "./pages/Make";
import Order from "./pages/Order";
import Share from "./pages/Share";
import Header from "./components/Header";
import GuidedTour from "./components/GuidedTour";
import LoginModal from "./components/LoginModal";

function App() {
  const [runTour, setRunTour] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <Router>
      <Header setIsLoginOpen={setIsLoginOpen} />
      <GuidedTour
        runTour={runTour}
        setRunTour={setRunTour}
        setIsLoginOpen={setIsLoginOpen}
      />
      {isLoginOpen && (
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      )}
      <Routes>
        <Route path="/" element={<Home setRunTour={setRunTour} />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/make" element={<Make />} />
        <Route path="/order" element={<Order />} />
        <Route path="/share" element={<Share />} />
        {/* 404 Fallback Route */}
        <Route
          path="*"
          element={<div className="text-center py-10 text-2xl">Page Not Found</div>}
        />
      </Routes>
    </Router>
  );
}

export default App;
