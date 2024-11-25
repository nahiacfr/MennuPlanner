// src/App.js
import React, { useState } from 'react';
import './styles.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import RecipeViewer from './components/RecipeViewer';
import AñadirReceta from './components/AñadirReceta';  // Importar AñadirReceta
import WeeklyCalendar from './components/WeeklyCalendar';  // Importar el componente de menú semanal
import { getRecipes } from './api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]); // Estado para manejar las recetas favoritas
  const [token, setToken] = useState(null);
  const [showAddRecipeForm, setShowAddRecipeForm] = useState(false); // Estado para controlar si se muestra el formulario
  const [showMenu, setShowMenu] = useState(false); // Estado para mostrar el menú semanal
  const [activeSection, setActiveSection] = useState('user'); // Estado para gestionar la sección activa

  // Función para manejar el login
  const handleLogin = async (token) => {
    setIsLoggedIn(true);
    setToken(token);
    try {
      const recipes = await getRecipes(token); // Pasar el token para obtener recetas
      setRecipes(recipes);
    } catch (err) {
      console.error('Error al obtener recetas:', err.message);
    }
  };

  // Funciones para cambiar entre Login y Register
  const handleSwitchToRegister = () => setShowLogin(false);
  const handleSwitchToLogin = () => setShowLogin(true);

  // Función para agregar una nueva receta
  const addNewRecipe = (newRecipe) => {
    setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
    setShowAddRecipeForm(false); // Cerrar el formulario después de añadir la receta
  };

  // Función para mostrar el menú semanal
  const showWeeklyMenu = () => {
    setActiveSection('menu');
  };

  // Función para agregar receta a favoritos
  const addToFavorites = (recipe) => {
    setFavoriteRecipes((prevFavorites) => [...prevFavorites, recipe]);
  };

  // Función para manejar la selección de sección en Navbar
  const handleSectionChange = (section) => {
    setActiveSection(section);
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
              token={token} 
              favoriteRecipes={favoriteRecipes} 
              setFavoriteRecipes={setFavoriteRecipes}
              onBackToRecipes={() => setActiveSection('user')} // Volver a la vista de recetas
            />
          ) : (
            <>
              <RecipeViewer 
                availableRecipes={recipes} 
                onAddRecipeClick={() => setShowAddRecipeForm(true)}  
                onShowMenuClick={showWeeklyMenu}  
                onAddToFavorites={addToFavorites}
                activeSection={activeSection} // Pasar la sección activa a RecipeViewer
                onSectionChange={handleSectionChange} // Función para manejar el cambio de sección
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;

