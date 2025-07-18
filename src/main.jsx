import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRouter from './routes/AppRouter.jsx'
import { AppProvider } from './context/AppProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <AppRouter />
    </AppProvider>
  </StrictMode>,
)
