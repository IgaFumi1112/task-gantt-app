// src/App.js
import React from 'react';
import AppRouter from './router';
import Header from './components/layout/Header';

export default function App() {
  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        {/* BrowserRouter はここでは使わない */}
        <AppRouter />
      </div>
    </div>
  );
}
