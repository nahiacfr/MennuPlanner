import React, { useState } from 'react';
import { getUserId } from '../api'; 
const AñadirReceta = ({ onAddRecipe, onCancel }) => {
  const [nombre, setNombre] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [instrucciones, setInstrucciones] = useState('');
  const [tiempoPreparacion, setTiempoPreparacion] = useState('');
  const [imagenUrl, setImagenUrl] = useState(''); // Estado para la URL de la imagen

  const handleImageUrlChange = (e) => {
    setImagenUrl(e.target.value); // Guardamos la URL ingresada
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

// Crear el objeto de receta
const newRecipe = {
  nombre,
  ingredientes, // Texto plano separado por comas
  instrucciones, // Texto plano separado por puntos
  tiempo_preparacion: tiempoPreparacion,
  imagen_url: imagenUrl, // URL de la imagen ingresada por el usuario
  userId: getUserId(), // Incluye el userId en el objeto de receta
};

// Enviar la receta al backend
const response = await fetch('http://localhost:5000/api/recipes/add', {
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
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Ingredientes (separados por comas):</label>
          <input
            type="text"
            value={ingredientes}
            onChange={(e) => setIngredientes(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Instrucciones (separadas por puntos):</label>
          <textarea
            value={instrucciones}
            onChange={(e) => setInstrucciones(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tiempo de preparación:</label>
          <input
            type="text"
            value={tiempoPreparacion}
            onChange={(e) => setTiempoPreparacion(e.target.value)}
            required
          />
        </div>
        <div>
          <label>URL de la imagen:</label>
          <input
            type="url"
            value={imagenUrl}
            onChange={handleImageUrlChange}
            placeholder="Introduce la URL de la imagen"
            required
          />
        </div>
        {imagenUrl && (
          <div className="image-preview">
            <h4>Vista previa de la imagen:</h4>
            <img src={imagenUrl} alt="Vista previa de la receta" style={{ maxWidth: '200px' }} />
          </div>
        )}
        <button type="submit">Guardar Receta</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </form>
    </div>
  );
};

export default AñadirReceta;
