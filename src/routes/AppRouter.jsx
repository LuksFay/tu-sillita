import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import  Home  from '../pages/Home'
import  Dashboard  from '../pages/Dashboard'
import  Qr  from '../components/Qr'
const AppRouter = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/qr" element={<Qr/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>

    </Router>
  )
}

export default AppRouter