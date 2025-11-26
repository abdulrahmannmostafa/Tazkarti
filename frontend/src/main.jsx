import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { ReservationProvider } from './context/ReservationContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ReservationProvider>
        <App />
      </ReservationProvider>
    </AuthProvider>
  </React.StrictMode>
);
