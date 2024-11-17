// src/components/RecipeViewer.js
import React, { useState } from 'react';
import RecipeCard from './RecipeCards';
import RecipeDetails from './RecipeDetails';
import '../styles.css';

const RecipeViewer = ({ availableRecipes }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Estado para la receta seleccionada
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
    setSelectedRecipe(recipe); // Establecer la receta seleccionada
  };

  const handleBackToRecipes = () => {
    setSelectedRecipe(null); // Volver a la lista de recetas
  };

  return (
    <div className="recipe-viewer">
      {selectedRecipe ? (
        // Mostrar los detalles de la receta si se seleccionó una
        <div>
          <button onClick={handleBackToRecipes} className="back-button">Volver a Recetas</button>
          <RecipeDetails
            recipe={selectedRecipe}
            onAddToFavorites={() => alert(`${selectedRecipe.name} añadido a favoritos!`)}
            onEdit={() => alert(`Editando ${selectedRecipe.name}`)}
          />
        </div>
      ) : (
        // Mostrar la lista de recetas si no se ha seleccionado ninguna
        <div>
          <h3>Recetas Disponibles</h3>
          <div className="recipe-grid">
            {currentRecipes.map((recipe, index) => (
              <div key={index} onClick={() => handleRecipeClick(recipe)}>
                <RecipeCard recipe={recipe} draggable={false} />
              </div>
            ))}
          </div>
          <div className="pagination-controls">
            <button onClick={prevPage} disabled={currentPage === 0} className="pagination-button">
              &lt; Anterior
            </button>
            <button
              onClick={nextPage}
              disabled={endIndex >= availableRecipes.length}
              className="pagination-button"
            >
              Siguiente &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeViewer;
