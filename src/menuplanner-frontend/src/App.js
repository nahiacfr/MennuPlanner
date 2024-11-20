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
    const recipes = await getRecipes(); // Obtener recetas tras login
    setRecipes(recipes);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        showLogin ? (
          <>
            <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setShowLogin(false)} />
            <button onClick={() => setShowLogin(false)}>Ir a Registro</button>
          </>
        ) : (
          <>
            <RegisterForm onRegister={() => setShowLogin(true)} />
            <button onClick={() => setShowLogin(true)}>Ir a Login</button>
          </>
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

