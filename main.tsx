// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Correct: Only BrowserRouter here
import { OrderProvider } from './pages/Orderss/OrderContext'; // Path to your context
import App from './App';
import './index.css'; // Global CSS file

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    {/* BrowserRouter wraps the entire application */}
    <BrowserRouter>
      {/* OrderProvider makes order context available throughout the app */}
      <OrderProvider>
        {/* Your main App component, which will now handle its internal routing logic */}
        <App />
      </OrderProvider>
    </BrowserRouter>
  </React.StrictMode>
);