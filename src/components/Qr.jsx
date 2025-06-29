import React from 'react'

const Qr = () => {
  return (
    <>
    <section>
        <div>
            <img src="" alt="QR" />
            <h2>Escáner</h2>
            <p>Escanea el código del pasajero para entregar o devolver sillas</p>
            <div>
                {/* Add QR code here */}
            </div>
            <hr/>
            <div>
                <p>Ingresa el codigo manualmente</p>
                <input type="text" placeholder='Ingresa el código aquí'/>
            </div>
        </div>
    </section>
    </>
  )
}
export default Qr