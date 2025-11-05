// frontend/src/index.js  ←  YOUR ORIGINAL + 3 LINES = FIXED
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';   // ← ADDED
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>         // ← WRAPS EVERYTHING
    <App />
  </BrowserRouter>
);
