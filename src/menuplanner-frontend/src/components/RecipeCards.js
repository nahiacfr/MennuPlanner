import React from 'react';
import '../styles.css';

const RecipeCard = ({ recipe, draggable, onDragStart }) => {
  return (
    <div
      className="recipe-card"
      draggable={draggable}
      onDragStart={(e) => onDragStart(e, recipe)}
    >
      <img src={recipe.image} alt={recipe.name} className="recipe-image" />
      <p>{recipe.name}</p>
    </div>
  );
};

export default RecipeCard;
