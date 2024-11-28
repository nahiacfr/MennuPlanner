// src/components/WeeklyCalendar.js
import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCards'; // Asegúrate de tener este componente
import '../styles.css';
import { getUserEmail } from '../api';

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const WeeklyCalendar = ({ userEmail, onBackToRecipes }) => { 
  const [favoriteRecipes, setFavoriteRecipes] = useState([]); // Recetas favoritas
  const [schedule, setSchedule] = useState(
    daysOfWeek.map(() => [null, null, null]) // Tres espacios por día para montar el horario
  );

  // Función para obtener las recetas favoritas
  const getFavoriteRecipes = async () => {
    try {
      const userEmail = getUserEmail(); // Obtener el correo del usuario
      if (!userEmail) {
        throw new Error('No se ha encontrado el correo del usuario. Inicia sesión nuevamente.');
      }

      // Enviar la solicitud al backend
      const response = await fetch(`http://localhost:3002/api/favorites?userId=${userEmail}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Validar respuesta del backend
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error en la respuesta del servidor:', errorData);
        alert(`Error: ${errorData.error || 'No se pudieron obtener las recetas favoritas.'}`);
        return;
      }

      // Obtener las recetas favoritas desde la respuesta
      const favoriteRecipes = await response.json();

      // Actualizar el estado local con las recetas favoritas
      setFavoriteRecipes(favoriteRecipes);

      console.log('Recetas favoritas obtenidas:', favoriteRecipes);
    } catch (err) {
      console.error('Error al obtener las recetas favoritas:', err.message);
      alert('Error al obtener las recetas favoritas. Intenta nuevamente.');
    }
  };

  // Cargar recetas favoritas y montar el horario al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener recetas favoritas
        await getFavoriteRecipes(); // Usamos la función getFavoriteRecipes
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, [userEmail]); // Cambiado a userEmail para obtener las recetas favoritas y horario

  // Manejar el inicio del arrastre de recetas
  const handleDragStart = (e, recipe) => {
    e.dataTransfer.setData('recipe', JSON.stringify(recipe));
  };

  // Manejar el evento de soltar recetas en el calendario
  const handleDrop = async (e, dayIndex, slotIndex) => {
    e.preventDefault();
    const recipe = JSON.parse(e.dataTransfer.getData('recipe'));
    const newSchedule = [...schedule];
    newSchedule[dayIndex][slotIndex] = recipe;
    setSchedule(newSchedule);

    // Actualizar el backend con el nuevo horario
    try {
      await fetch('/api/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail, 
          dayIndex,
          slotIndex,
          recipeId: recipe._id,  // Enviar el ID de la receta
        }),
      });
    } catch (error) {
      console.error('Error al actualizar el horario:', error);
    }
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
          {favoriteRecipes.map((recipe, index) => (
            <RecipeCard
              key={index}
              recipe={recipe}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, recipe)} // Aquí está el arrastre
            />
          ))}
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
                onDrop={(e) => handleDrop(e, dayIndex, slotIndex)}
                onDragOver={handleDragOver}
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
