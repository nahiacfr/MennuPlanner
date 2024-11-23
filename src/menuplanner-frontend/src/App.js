// src/App.js
import React, { useState } from 'react';
import './styles.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import RecipeViewer from './components/RecipeViewer';
import AñadirReceta from './components/AñadirReceta';  // Importar AñadirReceta
import { getRecipes } from './api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [token, setToken] = useState(null);
  const [showAddRecipeForm, setShowAddRecipeForm] = useState(false); // Estado para controlar si se muestra el formulario

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
            // Mostrar el formulario de añadir receta
            <AñadirReceta 
              onAddRecipe={addNewRecipe} 
              onCancel={() => setShowAddRecipeForm(false)} 
            />
          ) : (
            <>
              <h2>Recetas Disponibles</h2>
              <RecipeViewer 
                availableRecipes={recipes} 
                onAddRecipeClick={() => setShowAddRecipeForm(true)}  // Mostrar el formulario de añadir receta
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
