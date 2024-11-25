import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Importar axios
import RecipeCard from './RecipeCards';  
import RecipeDetails from './RecipeDetails';  
import WeeklyCalendar from './WeeklyCalendar'; // Importa el componente del menú semanal
import Navbar from './Navbar';  

const RecipeViewer = ({ availableRecipes, onAddRecipeClick, onShowMenuClick, onAddToFavorites }) => {
  const [currentPageUser, setCurrentPageUser] = useState(0); 
  const [currentPageImported, setCurrentPageImported] = useState(0); 
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [activeSection, setActiveSection] = useState('user'); 
  const [importedRecipesFromApi, setImportedRecipesFromApi] = useState([]);
  const recipesPerPage = 4;

  const userCreatedRecipes = availableRecipes.filter(recipe => recipe.isUserCreated);
  const importedRecipes = availableRecipes.filter(recipe => recipe.isImported);

  // Clave
  const SPOONACULAR_API_KEY = 'b7477f47c23747af82ece6da3ad33946';  

  // Función para obtener recetas importadas desde Spoonacular
  const fetchImportedRecipes = async () => {
    try {
      // Endpoint de Spoonacular para obtener recetas
      const response = await axios.get('https://api.spoonacular.com/recipes/random', {
        params: {
          number: 10,  // Número de recetas a obtener
          apiKey: SPOONACULAR_API_KEY
        }
      });
      // Guardar las recetas importadas en el estado
      setImportedRecipesFromApi(response.data.recipes);
    } catch (error) {
      console.error('Error al obtener recetas importadas:', error);
    }
  };

  // Llamar a la función fetchImportedRecipes cuando el componente se monte
  useEffect(() => {
    fetchImportedRecipes();
  }, []);

  const startIndexUser = currentPageUser * recipesPerPage;
  const endIndexUser = startIndexUser + recipesPerPage;
  const currentUserRecipes = userCreatedRecipes.slice(startIndexUser, endIndexUser);

  const startIndexImported = currentPageImported * recipesPerPage;
  const endIndexImported = startIndexImported + recipesPerPage;
  const currentImportedRecipes = importedRecipesFromApi.slice(startIndexImported, endIndexImported);

  const nextPageUser = () => {
    if (endIndexUser < userCreatedRecipes.length) setCurrentPageUser(currentPageUser + 1);
  };

  const prevPageUser = () => {
    if (currentPageUser > 0) setCurrentPageUser(currentPageUser - 1);
  };

  const nextPageImported = () => {
    if (endIndexImported < importedRecipesFromApi.length) setCurrentPageImported(currentPageImported + 1);
  };

  const prevPageImported = () => {
    if (currentPageImported > 0) setCurrentPageImported(currentPageImported - 1);
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);  // Establece la receta seleccionada
  };

  const handleBackToRecipes = () => {
    setSelectedRecipe(null);  // Vuelve a mostrar la lista de recetas
  };

  const handleSelectRecipesUser = () => setActiveSection('user');
  const handleSelectRecipesImported = () => setActiveSection('imported');
  const handleSelectMenu = () => setActiveSection('menu'); // Cambiar a "Menu"

  return (
    <div className="recipe-viewer">
      <Navbar 
        onSelectRecipesUser={handleSelectRecipesUser}
        onSelectRecipesImported={handleSelectRecipesImported}
        onSelectMenu={handleSelectMenu} // Cambiar a "Menu"
      />

      {selectedRecipe ? (
        <div>
          <button onClick={handleBackToRecipes}>Volver a Recetas</button>
          <RecipeDetails 
            recipe={selectedRecipe} 
            onAddToFavorites={() => onAddToFavorites(selectedRecipe)} 
            onEdit={() => console.log('Editar receta:', selectedRecipe)} 
          />
        </div>
      ) : (
        <div>
          {activeSection === 'user' && (
            <div>
              <h3>Recetas Creadas por el Usuario</h3>
              <button onClick={onAddRecipeClick}>Registrar Receta</button>
              <div className="recipe-grid">
                {currentUserRecipes.map((recipe) => (
                  <div key={recipe.id} onClick={() => handleRecipeClick(recipe)}>
                    <RecipeCard recipe={recipe} />
                  </div>
                ))}
              </div>
              <div className="pagination-controls">
                <button onClick={prevPageUser} disabled={currentPageUser === 0}>
                  Anterior
                </button>
                <button onClick={nextPageUser} disabled={endIndexUser >= userCreatedRecipes.length}>
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {activeSection === 'imported' && (
            <div>
              <h3>Recetas Importadas</h3>
              <div className="recipe-grid">
                {currentImportedRecipes.map((recipe) => (
                  <div key={recipe.id} onClick={() => handleRecipeClick(recipe)}>
                    {/* Mostrar el nombre de la receta importada */}
                    <RecipeCard 
                      recipe={recipe} 
                      title={recipe.title}  // Pasar el título de la receta a RecipeCard
                    />
                    {/* Alternativamente, si tienes un componente específico para mostrar el nombre, puedes hacerlo aquí */}
                    <p>{recipe.title}</p>
                  </div>
                ))}
              </div>
              <div className="pagination-controls">
                <button onClick={prevPageImported} disabled={currentPageImported === 0}>
                  Anterior
                </button>
                <button onClick={nextPageImported} disabled={endIndexImported >= importedRecipesFromApi.length}>
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {activeSection === 'menu' && (
            <div>
              <h3>Menú Semanal</h3>
              <WeeklyCalendar 
                favoriteRecipes={availableRecipes.filter(recipe => recipe.isFavorite)}
                onBackToRecipes={handleBackToRecipes} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeViewer;