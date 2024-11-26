import React from 'react';
import '../styles.css';

const RecipeCard = ({ recipe, draggable, onDragStart }) => {
  // Si la receta tiene 'imageUrl', es una receta creada por el usuario
  // Si no tiene 'imageUrl', es una receta importada, así que usamos 'image'
  const imageUrl = recipe.imageUrl || recipe.image || 'https://via.placeholder.com/150'; // Imagen predeterminada si no existe

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
      <p>{recipe.title}</p>
    </div>
  );
};

export default RecipeCard;


