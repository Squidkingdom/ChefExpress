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

// import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Make from './pages/Make'
import Order from './pages/Order'
import Login from './pages/Login'
import Share from './pages/Share' 
import Header from './components/Header'
import './App.css'

function App() {
  

  return (
    <Router>
      <Header/>
        <Routes>
          {/** Display the correct page based on the URL path. */}
          <Route path="/" element={<Home/>}/>
          <Route path="/learn" element={<Learn/>} />
          <Route path="/make" element={<Make/>}  />
          <Route path="/order" element={<Order/>} />
          <Route path="/share" element={<Share/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
    </Router>
  )
}

export default App
