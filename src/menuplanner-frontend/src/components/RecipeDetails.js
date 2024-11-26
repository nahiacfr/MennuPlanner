import React, { useState } from 'react';
import '../styles.css';

const RecipeDetails = ({ recipe, onAddToFavorites, onEdit, onAddToMyRecipes }) => {
  const [favoriteMessage, setFavoriteMessage] = useState('');

  const handleAddToFavorites = () => {
    onAddToFavorites();
    setFavoriteMessage('¡Receta añadida a favoritos!');
    setTimeout(() => setFavoriteMessage(''), 3000);
  };

  const handleAddToImportedRecipes = async () => {
    console.log('Receta:', recipe);  // Verifica que la receta contiene los datos correctos
    
    const importedRecipe = {
      name: recipe.title,  
      ingredients: recipe.extendedIngredients.map((ingredient) => ingredient.original),  
      instructions: recipe.instructions.split('.').map((instruction) => instruction.trim()).filter((instruction) => instruction.length > 0),  
      imageUrl: recipe.image || 'https://via.placeholder.com/150',  
    };
    
    console.log('Receta importada:', importedRecipe);  // Verifica que los datos estén correctos
  
    try {
      const response = await fetch('http://localhost:5000/api/recipes/imported/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(importedRecipe),
      });
  
      if (!response.ok) {
        throw new Error('Error al añadir la receta importada');
      }
  
      const data = await response.json();
      console.log('Receta importada añadida:', data);
    } catch (error) {
      console.error(error);
    }
  };
  

  const ingredientsList = recipe.isUserCreated
    ? recipe.ingredients.split(',').map((ingredient) => ingredient.trim()) // Ingredientes de recetas del usuario
    : recipe.extendedIngredients.map((ingredient) => ingredient.original); // Ingredientes de Spoonacular

  const instructionsList = recipe.instructions.split('.').map((instruction) => instruction.trim()).filter(Boolean);

  const imageUrl = recipe.imageUrl || recipe.image || 'https://via.placeholder.com/150';  // Imagen predeterminada si no existe

  return (
    <div className="recipe-details">
      <h2>{recipe.name}</h2>
      <div className="recipe-container">
        <img src={imageUrl} alt={recipe.name} />
        <div className="recipe-info">
          <h3>Ingredientes</h3>
          <ul>
            {ingredientsList.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="recipe-instructions">
        <h3>Instrucciones</h3>
        <ol>
          {instructionsList.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </div>

      {favoriteMessage && <div className="alert">{favoriteMessage}</div>}

      <div className="recipe-buttons">
        {recipe.isUserCreated ? (
          <>
            <button onClick={handleAddToFavorites}>Añadir a Fav</button>
            <button onClick={onEdit}>Editar</button>
          </>
        ) : (
          <button onClick={handleAddToImportedRecipes}>Añadir a Mis Recetas</button>
        )}
      </div>
    </div>
  );
};

export default RecipeDetails;