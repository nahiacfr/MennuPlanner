// src/components/RecipeDetails.js
import React from 'react';
import '../styles.css';

const RecipeDetails = ({ recipe, onAddToFavorites, onEdit }) => {
  return (
    <div className="recipe-details">
      <h2>{recipe.name}</h2>
      <div className="recipe-container">
        <img src={recipe.image} alt={recipe.name} />
        <div className="recipe-info">
          <h3>Ingredientes</h3>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="recipe-instructions">
        <h3>Instrucciones</h3>
        <ol>
          {recipe.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </div>
      <div className="recipe-buttons">
        <button onClick={onAddToFavorites}>Añadir a Fav</button>
        <button onClick={onEdit}>Editar</button>
      </div>
    </div>
  );
};

export default RecipeDetails;