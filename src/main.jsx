// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from "./context/FavoritesContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FavoritesProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
    </FavoritesProvider>
  </React.StrictMode>
);