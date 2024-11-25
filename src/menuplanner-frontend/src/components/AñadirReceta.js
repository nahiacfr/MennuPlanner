import React, { useState } from 'react';

const AñadirReceta = ({ onAddRecipe, onCancel }) => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState(null); // Estado para la imagen

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Guardamos el archivo de la imagen en lugar de su URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Subir la imagen al servidor si existe
    let imageUrl = '';
    if (image) {
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch('http://localhost:5000/api/upload_image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        imageUrl = data.imageUrl; // Obtener la URL de la imagen subida
      } else {
        alert('Error al subir la imagen');
        return;
      }
    }

    // Crear el objeto de receta
    const newRecipe = {
      name,
      ingredients: ingredients.split(','), // Separar ingredientes por comas
      instructions: instructions.split('.'), // Separar instrucciones por puntos
      time_preparation: time,
      imagen_url: imageUrl, // URL de la imagen, si se subió correctamente
    };

    // Enviar la receta al backend
    const response = await fetch('http://localhost:5000/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecipe),
    });

    if (response.ok) {
      onAddRecipe(newRecipe); // Agregar la receta a la lista de recetas
      onCancel(); // Cerrar el formulario
    } else {
      const error = await response.json();
      alert(`Error: ${error.error}`);
    }
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
          <label>Tiempo de preparación:</label>
          <input 
            type="text" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
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
            <img src={URL.createObjectURL(image)} alt="Vista previa de la receta" style={{ maxWidth: '200px' }} />
          </div>
        )}
        <button type="submit">Guardar Receta</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </form>
    </div>
  );
};

export default AñadirReceta;