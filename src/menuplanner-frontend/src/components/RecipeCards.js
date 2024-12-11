import React from 'react';
import '../styles.css';

const RecipeCard = ({ recipe, draggable, onDragStart }) => {
  const imageUrl = recipe.imageUrl || recipe.image || recipe.imagenUrl || 'https://via.placeholder.com/150'; // Imagen predeterminada si no existe

  // Función para truncar texto si excede el límite
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

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
        onError={(e) => (e.target.src = 'https://via.placeholder.com/150')} // Si no carga, mostrar imagen predeterminada
      />
      {/* Título truncado para evitar desbordamientos */}
      <p className="recipe-title">{truncateText(recipe.title, 20)}</p>
    </div>
  );
};

export default RecipeCard;



