// src/App.js
import React, { useState } from 'react';
import './styles.css';
import WeeklyCalendar from './components/WeeklyCalendar';

function App() {
  // Simulando datos de recetas favoritas para probar
  const favoriteRecipes = [
    { name: 'Panqueques', image: 'url_panqueques.jpg' },
    { name: 'Ensalada', image: 'url_ensalada.jpg' },
    { name: 'Pollo al horno', image: 'url_pollo.jpg' },
    { name: 'Batido de frutas', image: 'url_batido.jpg' },
    // Agrega más recetas de ejemplo si es necesario
  ];

  return (
    <div className="App">
      {/* Comentar o eliminar la parte de LoginForm y RegisterForm */}
      {/* 
      {showLogin ? (
        <>
          <LoginForm onLogin={(token) => console.log('Token recibido:', token)} />
          <button onClick={() => setShowLogin(false)}>Ir a Registro</button>
        </>
      ) : (
        <>
          <RegisterForm />
          <button onClick={() => setShowLogin(true)}>Ir a Login</button>
        </>
      )}
      */}
      
      {/* Mostrar directamente el calendario semanal */}
      <WeeklyCalendar favoriteRecipes={favoriteRecipes} />
    </div>
  );
}

export default App;