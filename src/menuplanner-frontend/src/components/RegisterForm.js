import React, { useState } from "react";
import { register } from "../api";

const RegisterForm = ({ onRegister }) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(nombre, correo, contrasena);
      setSuccess(response.message);
      setError("");
      onRegister();
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <div className="app-container">
      <form onSubmit={handleSubmit} className="form-container">
        <h2>Registro</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        <div>
          <button type="submit">Registrar</button>
          <button type="button">Ir a Login</button>
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default RegisterForm;

