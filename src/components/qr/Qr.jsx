import React, { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import api from '../../services/api'
import { ENDPOINTS } from '../../services/endpoints'
import './Qr.css'

const Qr = () => {
  const scannerRef = useRef(null)
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')
  const [manual, setManual] = useState('')

  useEffect(() => {
    if (!scannerRef.current) return

    const qrScanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    })

    qrScanner.render(
      async (decodedText) => {
        qrScanner.clear()
        handleLookup(decodedText)
      },
      (err) => {
        console.warn('Error escaneando:', err)
      }
    )

    return () => qrScanner.clear()
  }, [])

  const handleLookup = async (qr) => {
    try {
      const res = await api.get(ENDPOINTS.getPaxByQR(qr))
      setResultado(res.data)
      setError('')
    } catch (err) {
      setResultado(null)
      setError('QR no válido o pasajero no encontrado')
    }
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    handleLookup(manual)
  }

  return (
    <section>
      <div className="qr-section">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-qr-code-icon lucide-qr-code"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
        <h2>Escáner QR</h2>
        <p>Escanea el código del pasajero para entregar o devolver sillas</p>


        <div id="qr-reader" ref={scannerRef}></div>

        <hr />

        
        <form onSubmit={handleManualSubmit}>
          <p>O ingresa el código manualmente</p>
          <input
            type="text"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder="Ingresa el código aquí"
          />
          <button type="submit">Buscar</button>
        </form>

        {resultado && (
          <div className="qr-result">
            <h3>Pasajero</h3>
            <p><strong>Nombre:</strong> {resultado.nombre}</p>
            <p><strong>Estado:</strong> {resultado.estado}</p>
            <p><strong>Sillas:</strong> {resultado.cantidad_sillas}</p>
            <p><strong>Fecha:</strong> {new Date(resultado.fecha_creacion).toLocaleDateString()}</p>
          </div>
        )}

        {error && <p className="error">{error}</p>}
      </div>
    </section>
  )
}

export default Qr
