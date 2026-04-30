import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './Store/ReduxSlice/store.js'
import { AuthProvider } from './Contexts/AuthContext.jsx'
import { NotificationProvider } from './Contexts/NotificationContext.jsx'
import { HelmetProvider } from 'react-helmet-async';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <Provider store={store}>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </Provider>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
)
