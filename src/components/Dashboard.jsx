import React from 'react'

const Dashboard = () => {
  return (
    <>
        <section>
            <div>
                <h2>
                    Panel de Administración
                </h2>
                <button>Salir</button>
            </div>
            <div>
                <ul>
                    <li><button>Coordinadores</button></li>
                    <li><button>Hoteles</button></li>
                    <li><button>Reservas</button></li>
                    <li><button>Reportes</button></li>
                </ul>
            </div>
        </section>
        <section>
            {/* Div dinamico*/}
        </section>
  </>
  )
}

export default Dashboard