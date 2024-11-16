// src/components/RegisterForm.js
import React, { useState } from 'react';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: name, correo: email, contrasena: password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registro exitoso');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error al registrarse:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>MenuPLanner</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Usuario:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">REGISTRARME</button>
      </form>
    </div>
  );
};

export default RegisterForm;
