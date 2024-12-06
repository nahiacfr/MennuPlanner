import React from 'react';
import '../styles.css';

const RecipeCard = ({ recipe, draggable, onDragStart }) => {
  const imageUrl = recipe.imageUrl || recipe.image || recipe.imagenUrl || 'https://via.placeholder.com/150'; // Imagen predeterminada si no existe

  return (
    <div
      className="recipe-card"
      draggable={draggable}
      onDragStart={(e) => onDragStart(e, recipe)}
    >
      <img
        src={imageUrl} // Usar la URL directamente aquí
        alt={recipe.title}
        className="recipe-image"
        onError={(e) => e.target.src = 'https://via.placeholder.com/150'} // Si no carga, mostrar imagen predeterminada
      />
      <p>{recipe.title}</p> {/* Mostrar el título de la receta */}
    </div>
  );
};

export default RecipeCard;



