import React, { useState } from "react";
import { login } from "../api";

const LoginForm = ({ onLogin, onSwitchToRegister }) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!correo || !contrasena) {
      setError("Todos los campos son obligatorios");
      return;
    }
    try {
      const { token } = await login(correo, contrasena);
      onLogin(token);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-container">
      <form onSubmit={handleSubmit} className="form-container">
        <h2>MenuPlanner</h2>
        <input
          type="email"
          placeholder="Usuario"
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
          <button type="submit">Login</button>
          <button type="button" onClick={onSwitchToRegister}>Registrarme</button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;