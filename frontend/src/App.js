// src/App.js
import React from 'react';
import AppRouter from './router';
import Header from './components/layout/Header';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="container mx-auto p-4">
        <AppRouter />
      </div>
    </div>
  );
}

export default App;
