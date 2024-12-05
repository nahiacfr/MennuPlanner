import React, { useState, useEffect, useCallback } from 'react';
import RecipeCard from './RecipeCards'; // Asegúrate de tener este componente
import '../styles.css';
import { getUserEmail } from '../api'; // Importamos la función

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const WeeklyCalendar = ({ onBackToRecipes }) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]); // Estado para las recetas favoritas
  const [schedule, setSchedule] = useState(daysOfWeek.map(() => [null, null, null])); // Calendario semanal
  const [userEmail, setUserEmail] = useState(null); // Estado para el correo del usuario
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  // Obtener recetas favoritas desde la API
  const getFavoriteRecipes = useCallback(async () => {
    if (!userEmail) {
      console.error('No se ha encontrado el correo del usuario');
      setError('No se ha encontrado el correo del usuario.');
      return;
    }

    try {
      console.log('Iniciando la llamada a la API para obtener las recetas favoritas...');

      const response = await fetch(`http://localhost:3002/api/favorites?email=${userEmail}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Error en la respuesta del backend', response.status);
        setError('Error en la respuesta del servidor.');
        return;
      }

      const favoriteRecipes = await response.json();
      console.log('Respuesta del servidor:', favoriteRecipes);

      if (Array.isArray(favoriteRecipes) && favoriteRecipes.length > 0) {
        setFavoriteRecipes(favoriteRecipes);
        setError(null); // Limpiamos cualquier error previo
      } else {
        setFavoriteRecipes([]); // No hay recetas favoritas
        setError('No tienes recetas favoritas.');
      }
    } catch (err) {
      console.error('Error al obtener las recetas favoritas:', err.message);
      setError('Hubo un problema al cargar las recetas.');
    } finally {
      setLoading(false); // Cambiamos el estado de carga
    }
  }, [userEmail]);

  // Obtener el correo del usuario cuando se monta el componente
  useEffect(() => {
    const email = getUserEmail(); // Llamamos a la función que obtiene el correo
    console.log('Correo del usuario:', email); // Verificamos el correo obtenido

    if (email) {
      setUserEmail(email); // Establecemos el correo en el estado
    } else {
      setError('No se pudo obtener el correo del usuario.');
    }
  }, []); // Este useEffect solo se ejecuta una vez

  // Una vez que tengamos el correo, obtenemos las recetas favoritas
  useEffect(() => {
    if (userEmail) {
      getFavoriteRecipes(); // Llamamos a la API para obtener las recetas
    }
  }, [userEmail, getFavoriteRecipes]);

  // Función para guardar el calendario de comidas
  const saveSchedule = (newSchedule) => {
    setSchedule(newSchedule); // Solo se actualiza el estado local
  };

  // Funciones para manejar el drag and drop de recetas
  const handleDragStart = (e, recipe) => {
    e.dataTransfer.setData('recipe', JSON.stringify(recipe));
  };

  const handleDrop = (e, dayIndex, slotIndex) => {
    e.preventDefault();
    const recipe = JSON.parse(e.dataTransfer.getData('recipe'));
    const newSchedule = [...schedule];
    newSchedule[dayIndex][slotIndex] = recipe;
    saveSchedule(newSchedule); // Solo se actualiza el estado local
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="weekly-calendar">
      <div className="header">
        <h2>Planificador Semanal</h2>
        <button onClick={onBackToRecipes} className="back-button">
          Volver a Recetas
        </button>
      </div>

      <div className="favorites-bar">
        <h3>Recetas Favoritas</h3>
        <div className="favorites-container">
          {loading ? (
            <p>Cargando recetas favoritas...</p> // Mensaje de carga mientras se obtienen las recetas
          ) : error ? (
            <p>{error}</p> // Mensaje de error si ocurre un problema
          ) : favoriteRecipes.length === 0 ? (
            <p>No tienes recetas favoritas.</p> // Mensaje si no hay recetas favoritas
          ) : (
            favoriteRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                draggable={true} // La receta es arrastrable
                onDragStart={(e) => handleDragStart(e, recipe)} // Manejo del inicio de arrastre
              />
            ))
          )}
        </div>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map((day, dayIndex) => (
          <div key={dayIndex} className="day-column">
            <h4>{day}</h4>
            {schedule[dayIndex].map((slot, slotIndex) => (
              <div
                key={slotIndex}
                className="meal-slot"
                onDrop={(e) => handleDrop(e, dayIndex, slotIndex)} // Manejo de la caída
                onDragOver={handleDragOver} // Permite el arrastre sobre los slots
              >
                {slot ? <RecipeCard recipe={slot} draggable={false} /> : <div className="empty-slot">+</div>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendar;















