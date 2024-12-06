const API_URL = 'http://localhost:5000/api';
let userEmail = null; // Variable global para almacenar el correo del usuario
let userId = null; // Variable global para almacenar el ID del usuario

// Registrar un usuario
export const register = async (nombre, correo, contrasena) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, contrasena }),
    });

    if (!response.ok) {
      throw new Error((await response.json()).error || 'Error al registrar');
    }

    return await response.json(); // Regresa la respuesta del backend (probablemente el usuario creado)
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error;
  }
};

// Iniciar sesión
export const login = async (correo, contrasena) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena }),
    });

    if (!response.ok) {
      throw new Error((await response.json()).error || 'Error al iniciar sesión');
    }

    const data = await response.json();
    userEmail = correo; // Guardar el correo en la variable global
    userId = data.userId; // Guardar el ID del usuario en la variable global
    console.log('Correo almacenado:', userEmail);
    console.log('ID de usuario:', userId);

    return data; // Regresa la información del usuario desde el backend (incluyendo el token, si lo proporciona)
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

// Función para obtener el correo del usuario
export const getUserEmail = () => userEmail;

// Función para obtener el ID del usuario
export const getUserId = () => userId;

// Obtener recetas del usuario
export const getRecipes = async (token) => {
  if (!userId) {
    throw new Error('No se ha establecido el ID del usuario');
  }

  try {
    const response = await fetch(`${API_URL}/recipes?usuario_id=${userId}`, {
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
  } catch (error) {
    console.error('Error al obtener recetas:', error);
    throw error;
  }
};


