import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import  Home  from '../pages/Home'
import  Dashboard  from '../pages/Dashboard'
import  Qr  from '../components/qr/Qr'
import NavBar from '../components/navbar/NavBar'
import  FormularioPax  from '../pages/FormularioPax'
const AppRouter = () => {
  return (
    <Router>
      <div style={{ paddingBottom: '60px' }}>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/qr" element={<Qr/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/formulario/:qr_code" element={<FormularioPax />} />

        </Routes>
      </div>
      <NavBar />
    </Router>
  )
}

export default AppRouter