import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCards';  // Asegúrate de tener este componente
import '../styles.css';

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const WeeklyCalendar = ({ token }) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [schedule, setSchedule] = useState(
    daysOfWeek.map(() => [null, null, null]) // Tres espacios por día
  );

  // Obtener las recetas favoritas desde la API
  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFavoriteRecipes(data);
      } else {
        console.error('Error al obtener recetas favoritas');
      }
    };

    fetchFavoriteRecipes();
  }, [token]);

  // Función para guardar el menú semanal en la API
  const saveMenu = async () => {
    const menu = daysOfWeek.map((day, dayIndex) => ({
      dia: day,
      recetas: schedule[dayIndex].filter(slot => slot !== null).map(recipe => recipe.id),
    }));

    const response = await fetch('http://localhost:5000/api/weekly_menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ menu }),
    });

    if (response.ok) {
      console.log('Menú semanal actualizado');
    } else {
      console.error('Error al actualizar el menú semanal');
    }
  };

  // Manejar el inicio del arrastre de recetas
  const handleDragStart = (e, recipe) => {
    e.dataTransfer.setData('recipe', JSON.stringify(recipe));
  };

  // Manejar el evento de soltar recetas en el calendario
  const handleDrop = (e, dayIndex, slotIndex) => {
    e.preventDefault();
    const recipe = JSON.parse(e.dataTransfer.getData('recipe'));
    const newSchedule = [...schedule];
    newSchedule[dayIndex][slotIndex] = recipe;
    setSchedule(newSchedule);
    saveMenu();  // Guardar los cambios en el menú
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="weekly-calendar">
      <div className="favorites-bar">
        <h3>Recetas Favoritas</h3>
        <div className="favorites-container">
          {favoriteRecipes.map((recipe, index) => (
            <RecipeCard
              key={index}
              recipe={recipe}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, recipe)}
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

