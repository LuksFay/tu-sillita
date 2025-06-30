// src/pages/Dashboard.jsx
import React, { useState } from 'react'
import DashCoordinadores from '../components/DashCoordinadores'
import DashHoteles from '../components/DashHoteles'
import DashReservas from '../components/DashReservas'
import DashReportes from '../components/DashReportes'
import './Dashboard.css'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('coordinadores')

  const renderSection = () => {
    switch (activeTab) {
      case 'coordinadores':
        return <DashCoordinadores />
      case 'hoteles':
        return <DashHoteles />
      case 'reservas':
        return <DashReservas />
      case 'reportes':
        return <DashReportes />
      default:
        return null
    }
  }

  return (
    <>
      <section className="dashboard-header">
        <div className="dashboard-topbar">
          <h2>Panel de Administración</h2>
          <button className="logout-btn">Salir</button>
        </div>
        <div className="dashboard-tabs">
          <ul>
            <li><button className={activeTab === 'coordinadores' ? 'active' : ''} onClick={() => setActiveTab('coordinadores')}>Coordinadores</button></li>
            <li><button className={activeTab === 'hoteles' ? 'active' : ''} onClick={() => setActiveTab('hoteles')}>Hoteles</button></li>
            <li><button className={activeTab === 'reservas' ? 'active' : ''} onClick={() => setActiveTab('reservas')}>Reservas</button></li>
            <li><button className={activeTab === 'reportes' ? 'active' : ''} onClick={() => setActiveTab('reportes')}>Reportes</button></li>
          </ul>
        </div>
      </section>
      <section className="dashboard-content">
        {renderSection()}
      </section>
    </>
  )
}

export default Dashboard
