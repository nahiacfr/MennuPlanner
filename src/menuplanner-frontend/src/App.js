import React, { useState } from 'react';
import './styles.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import RecipeViewer from './components/RecipeViewer';
import { getRecipes } from './api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [token, setToken] = useState(null);

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

  const handleSwitchToRegister = () => setShowLogin(false);
  const handleSwitchToLogin = () => setShowLogin(true);

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
          <h2>Recetas Disponibles</h2>
          <RecipeViewer availableRecipes={recipes} />
        </>
      )}
    </div>
  );
}

export default App;

