import React, { useState, useEffect } from 'react';
import './styles.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import RecipeViewer from './components/RecipeViewer';
import AñadirReceta from './components/AñadirReceta'; // Importar AñadirReceta
import WeeklyCalendar from './components/WeeklyCalendar'; // Importar el componente de menú semanal
import { getRecipes, getUserEmail, getUserId } from './api'; // Importar getUserEmail y getUserId

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]); // Estado para manejar las recetas favoritas
  const [showAddRecipeForm, setShowAddRecipeForm] = useState(false); // Estado para controlar si se muestra el formulario
  const [activeSection, setActiveSection] = useState('user'); // Estado para gestionar la sección activa
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || ''); // Estado para almacenar el token del usuario

  // Función para manejar el login
  const handleLogin = async (token) => {
    setUserToken(token); // Almacenar el token en el estado
    localStorage.setItem('userToken', token); // Guardar el token en localStorage
    setIsLoggedIn(true);
    await fetchRecipes(token); // Obtener las recetas después de hacer login
  };

  // Función para obtener las recetas con el token de usuario
  const fetchRecipes = async (token) => {
    try {
      const recipes = await getRecipes(token); // Obtener recetas usando el token del usuario
      setRecipes(recipes); // Guardar las recetas en el estado
    } catch (err) {
      console.error('Error al obtener recetas:', err.message);
      alert('Error al obtener las recetas. Intenta nuevamente.');
    }
  };

  // Función para actualizar las recetas, llamada desde otras clases que no tienen el token
  const updateRecipes = async () => {
    const token = userToken || localStorage.getItem('userToken'); // Obtener el token del estado o localStorage
    if (token) {
      await fetchRecipes(token);
    } else {
      console.error('No se ha encontrado el token de usuario.');
      alert('Por favor, inicie sesión primero.');
    }
  };

  // Funciones para cambiar entre Login y Register
  const handleSwitchToRegister = () => setShowLogin(false);
  const handleSwitchToLogin = () => setShowLogin(true);

  // Función para agregar una nueva receta
  const addNewRecipe = async (newRecipe) => {
    try {
      setRecipes((prevRecipes) => [...prevRecipes, newRecipe]); // Añadir la receta localmente
      setShowAddRecipeForm(false); // Cerrar el formulario después de añadir la receta

      // Actualizar la lista de recetas desde el servidor
      await fetchRecipes(userToken); // Obtener las recetas después de agregar una nueva
    } catch (err) {
      console.error('Error al actualizar las recetas:', err.message);
      alert('Error al actualizar la lista de recetas. Intenta nuevamente.');
    }
  };

  const addToFavorites = async (recipe) => {
    try {
      const email = getUserEmail(); // Obtener el correo del usuario
      if (!email) {
        throw new Error('No se ha encontrado el correo del usuario. Inicia sesión nuevamente.');
      }

      const imageUrl = recipe.imageUrl || recipe.image;

      // Enviar la solicitud al backend
      const response = await fetch('http://localhost:3002/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email, // Utiliza email en lugar de userId
          recipeTitle: recipe.title, // Cambiar 'recipeId' por 'recipeTitle'
          ingredientes: recipe.ingredients, // Añadir ingredientes
          instrucciones: recipe.instructions, // Añadir instrucciones
          imagenUrl: imageUrl, // Enviar imagenUrl
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error en la respuesta del servidor:', errorData);
        alert(`Error: ${errorData.error || 'No se pudo agregar la receta a favoritos.'}`);
        return;
      }

      // Obtener las recetas favoritas actualizadas desde la respuesta
      const data = await response.json();
      setFavoriteRecipes(data.favoriteRecipes); // Actualizar las recetas favoritas

      console.log('Receta añadida a favoritos:', recipe);
    } catch (err) {
      console.error('Error al agregar a favoritos:', err.message);
      alert('Error al agregar la receta a favoritos. Intenta nuevamente.');
    }
  };

  // Función para manejar el cambio de sección en Navbar
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Función para mostrar el menú semanal
  const showWeeklyMenu = () => {
    setActiveSection('menu');
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        showLogin ? (
          <LoginForm 
            onLogin={handleLogin} 
            onSwitchToRegister={handleSwitchToRegister} 
          />
        ) : (
          <RegisterForm 
            onRegister={handleSwitchToLogin} 
            onSwitchToLogin={handleSwitchToLogin} 
          />
        )
      ) : (
        <>
          {showAddRecipeForm ? (
            <AñadirReceta 
              onAddRecipe={addNewRecipe} 
              onCancel={() => setShowAddRecipeForm(false)} 
            />
          ) : activeSection === 'menu' ? (
            <WeeklyCalendar 
              favoriteRecipes={favoriteRecipes} 
              setFavoriteRecipes={setFavoriteRecipes}
              onBackToRecipes={() => setActiveSection('user')} // Volver a la vista de recetas
            />
          ) : (
            <RecipeViewer 
              availableRecipes={recipes} 
              onAddRecipeClick={() => setShowAddRecipeForm(true)}  
              onShowMenuClick={showWeeklyMenu}  
              onAddToFavorites={addToFavorites}
              activeSection={activeSection} // Pasar la sección activa a RecipeViewer
              onSectionChange={handleSectionChange} // Función para manejar el cambio de sección
              userToken={userToken} // Pasar el token de usuario a RecipeViewer
              updateRecipes={updateRecipes} 
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
