// src/api.js

const API_URL = 'http://localhost:5000/api';

// Función para registrar un usuario
export const register = async (nombre, correo, contrasena) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, correo, contrasena }),
  });

  if (!response.ok) {
    throw new Error((await response.json()).error || 'Error al registrar');
  }

  return response.json();
};

// Función para iniciar sesión
export const login = async (correo, contrasena) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena }),
  });

  if (!response.ok) {
    throw new Error((await response.json()).error || 'Error al iniciar sesión');
  }

  return response.json(); // Devolverá el token
};

// Función para obtener recetas
export const getRecipes = async () => {
  const response = await fetch(`${API_URL}/recipes`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Error al obtener recetas');
  }

  return response.json(); // Devuelve las recetas
};
