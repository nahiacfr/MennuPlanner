// src/App.js
import React, { useState } from 'react';
import './styles.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="App">
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
    </div>
  );
}

export default App;
