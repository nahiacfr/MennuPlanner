import React, { useState } from 'react';

const AñadirReceta = ({ onAddRecipe, onCancel }) => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null); // Estado para la imagen

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Vista previa de la imagen
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear la nueva receta con la imagen
    const newRecipe = {
      name,
      ingredients: ingredients.split(','),  // Dividir los ingredientes por comas
      instructions: instructions.split('.'),  // Dividir las instrucciones por puntos
      image, // Añadir la URL de la imagen
      isUserCreated: true, // Marcar como receta creada por el usuario
    };

    onAddRecipe(newRecipe); // Llamar a la función que se pasó como prop para añadir la receta
  };

  return (
    <div className="add-recipe-form">
      <h2>Añadir Nueva Receta</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Ingredientes (separados por comas):</label>
          <input 
            type="text" 
            value={ingredients} 
            onChange={(e) => setIngredients(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Instrucciones (separadas por puntos):</label>
          <textarea 
            value={instructions} 
            onChange={(e) => setInstructions(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Imagen de la receta:</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
          />
        </div>
        {image && (
          <div className="image-preview">
            <h4>Vista previa de la imagen:</h4>
            <img src={image} alt="Vista previa de la receta" style={{ maxWidth: '200px' }} />
          </div>
        )}
        <button type="submit">Guardar Receta</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </form>
    </div>
  );
};

export default AñadirReceta;