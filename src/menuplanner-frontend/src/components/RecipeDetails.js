import React, { useState } from 'react'; // Importamos useState
import '../styles.css';

const RecipeDetails = ({ recipe, onAddToFavorites, onEdit }) => {
  // Estado para mostrar el mensaje de éxito
  const [favoriteMessage, setFavoriteMessage] = useState('');

  // Función para manejar el clic en el botón "Añadir a Fav"
  const handleAddToFavorites = () => {
    // Llamamos a la función pasada como prop (onAddToFavorites)
    onAddToFavorites();

    // Mostramos el mensaje de éxito
    setFavoriteMessage('¡Receta añadida a favoritos!');

    // Ocultamos el mensaje después de 3 segundos
    setTimeout(() => {
      setFavoriteMessage('');
    }, 3000);
  };

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

      {/* Mostrar el mensaje de éxito si está presente */}
      {favoriteMessage && (
        <div className="alert">{favoriteMessage}</div>
      )}

      <div className="recipe-buttons">
        {/* Usamos la función handleAddToFavorites para el clic en "Añadir a Fav" */}
        <button onClick={handleAddToFavorites}>Añadir a Fav</button>
        <button onClick={onEdit}>Editar</button>
      </div>
    </div>
  );
};

export default RecipeDetails;
