import React, { useState } from 'react';
import RecipeCard from './RecipeCards';
import '../styles.css';

const RecipeViewer = ({ availableRecipes }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const recipesPerPage = 4; // Número de recetas a mostrar por página

  // Calcular recetas para la página actual
  const startIndex = currentPage * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const currentRecipes = availableRecipes.slice(startIndex, endIndex);

  const nextPage = () => {
    if (endIndex < availableRecipes.length) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="recipe-viewer">
      <h3>Recetas Disponibles</h3>
      <div className="recipe-grid">
        {currentRecipes.map((recipe, index) => (
          <RecipeCard
            key={index}
            recipe={recipe}
            draggable={false} // Si decides implementar funcionalidad "drag & drop", cambia a true si es necesario
          />
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
  );
};

export default RecipeViewer;
