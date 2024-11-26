const API_URL = 'http://localhost:5000/api';

// Exportar las funciones de forma nombrada
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

export const login = async (correo, contrasena) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena }),
  });

  if (!response.ok) {
    throw new Error((await response.json()).error || 'Error al iniciar sesión');
  }

  return response.json();
};

export const getRecipes = async (token) => {
  const response = await fetch(`${API_URL}/recipes`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`, // Token JWT en el encabezado
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener recetas');
  }

  const recipes = await response.json();
  
  // Mapeamos las claves en español a las claves en inglés
  return recipes.map((recipe) => ({
    ...recipe,
    title: recipe.nombre,
    ingredients: recipe.ingredientes,
    instructions: recipe.instrucciones,
    preparationTime: recipe.tiempo_preparacion,
    imageUrl: recipe.imagen_url,
    isUserCreated: true, // Todas las recetas del backend se consideran creadas por el usuario
  }));
};


// Obtener el menú semanal desde la API
export const getWeeklyMenu = async (token) => {
  const response = await fetch(`${API_URL}/weekly_menu`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`, // Token JWT en el encabezado
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener el menú semanal');
  }

  return response.json();
};

// Guardar el menú semanal en la API
export const saveWeeklyMenu = async (menu, token) => {
  const response = await fetch(`${API_URL}/weekly_menu`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ menu }),
  });

  if (!response.ok) {
    throw new Error('Error al guardar el menú semanal');
  }

  return response.json();
};