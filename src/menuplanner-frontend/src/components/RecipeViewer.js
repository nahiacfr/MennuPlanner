import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCards';
import { Link } from 'react-router-dom'; // Para manejar la navegación entre páginas

const RecipeViewer = ({ availableRecipes, onAddRecipeClick, onShowMenuClick }) => {
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
    setSelectedRecipe(recipe);
  };

  const handleBackToRecipes = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="recipe-viewer">
      {selectedRecipe ? (
        <div>
          <button onClick={handleBackToRecipes}>Volver a Recetas</button>
          <RecipeCard recipe={selectedRecipe} />
        </div>
      ) : (
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
