// src/App.js
import React from 'react';
import './styles.css';
import RecipeDetails from './components/RecipeDetails';

function App() {
  // Datos de ejemplo para una receta concreta
  const recipe = {
    name: 'Espaguetis Carbonara',
    image: 'https://via.placeholder.com/200?text=Carbonara',
    ingredients: [
      'Espaguetis: 400 g',
      'Guanciale (o panceta): 150 g',
      'Yemas de huevo: 4',
      'Queso Pecorino Romano: 100 g (rallado)',
      'Pimienta negra: al gusto',
      'Sal: al gusto',
      'Agua: para hervir la pasta',
    ],
    instructions: [
      'Cocinar la Pasta: En una olla grande, lleva a ebullición agua con sal. Agrega los espaguetis y cocina según las instrucciones del paquete hasta que estén al dente.',
      'Preparar el Guanciale: Mientras la pasta se cocina, corta el guanciale en tiras y colócalo en una sartén grande a fuego medio. Cocina hasta que esté dorado y crujiente. Retira del fuego y reserva.',
      'Mezclar los Huevos y el Queso: En un bol grande, bate las yemas de huevo y mezcla con el queso rallado y una buena cantidad de pimienta negra.',
      'Combinar la Pasta: Cuando la pasta esté lista, escúrrela, reservando un poco del agua de cocción. Agrega los espaguetis a la sartén con el guanciale y mezcla bien.',
      'Añadir la Mezcla de Huevos: Retira la sartén del fuego y agrega rápidamente la mezcla de yemas y queso a la pasta, asegurándote de que el calor residual cocine los huevos. Si la mezcla es demasiado espesa, agrega un poco del agua de cocción reservada para aligerarla.',
      'Servir: Sirve inmediatamente, espolvoreando más queso y pimienta al gusto.',
    ],
  };

  const handleAddToFavorites = () => {
    alert(`${recipe.name} añadido a favoritos!`);
  };

  const handleEdit = () => {
    alert(`Editando ${recipe.name}`);
  };

  return (
    <div className="App">
      <RecipeDetails
        recipe={recipe}
        onAddToFavorites={handleAddToFavorites}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default App;