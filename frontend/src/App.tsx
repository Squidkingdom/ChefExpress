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
          <Route path="/" element={<Home/>}/>
          <Route path="/learn" element={<Learn/>} />
          <Route path="/make" element={<Make/>} />
          <Route path="/order" element={<Order/>} />
          <Route path="/share" element={<Share/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/login" element={<Login/>} />

        </Routes>
      
    </Router>
  )
}

export default App
