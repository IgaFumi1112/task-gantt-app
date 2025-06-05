// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/layout/Header';
import AppRouter from './router';

export default function App() {
  return (
   <div className="font-futuristic bg-cyber-bg min-h-screen text-neon-cyan">
     <Header />
     <main className="container mx-auto px-4 py-6">
       <div className="neon-outline p-4">
         <AppRouter />
       </div>
     </main>
   </div>
  );
}
