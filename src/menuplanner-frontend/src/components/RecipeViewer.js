import React, { useState } from 'react';
import RecipeCard from './RecipeCards';  // Asegúrate de tener este componente
import RecipeDetails from './RecipeDetails';  // Importa el componente RecipeDetails

const RecipeViewer = ({ availableRecipes, onAddRecipeClick, onShowMenuClick, onAddToFavorites }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const recipesPerPage = 4;

  const startIndex = currentPage * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const currentRecipes = availableRecipes.slice(startIndex, endIndex);

  const nextPage = () => {
    if (endIndex < availableRecipes.length) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);  // Establece la receta seleccionada
  };

  const handleBackToRecipes = () => {
    setSelectedRecipe(null);  // Vuelve a mostrar la lista de recetas
  };

  return (
    <div className="recipe-viewer">
      {selectedRecipe ? (
        // Mostrar detalles de la receta seleccionada
        <div>
          <button onClick={handleBackToRecipes}>Volver a Recetas</button>
          <RecipeDetails 
            recipe={selectedRecipe} 
            onAddToFavorites={() => onAddToFavorites(selectedRecipe)} // Llamar a la función para añadir a favoritos
            onEdit={() => console.log('Editar receta:', selectedRecipe)}  // Función de ejemplo para editar
          />
        </div>
      ) : (
        // Mostrar lista de recetas
        <div>
          <h3>Recetas Disponibles</h3>
          <button onClick={onAddRecipeClick}>Registrar Receta</button>
          <div>
            <button onClick={onShowMenuClick}>Mostrar Menú</button>
          </div>
          <div className="recipe-grid">
            {currentRecipes.map((recipe) => (
              <div key={recipe.id} onClick={() => handleRecipeClick(recipe)}>
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
          <div className="pagination-controls">
            <button onClick={prevPage} disabled={currentPage === 0}>
              Anterior
            </button>
            <button onClick={nextPage} disabled={endIndex >= availableRecipes.length}>
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeViewer;
