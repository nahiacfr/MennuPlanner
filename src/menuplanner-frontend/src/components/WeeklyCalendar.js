// src/components/WeeklyCalendar.js
import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCards'; // Asegúrate de tener este componente
import '../styles.css';

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const WeeklyCalendar = ({ token, favoriteRecipes, setFavoriteRecipes, onBackToRecipes }) => {
  const [schedule, setSchedule] = useState(
    daysOfWeek.map(() => [null, null, null]) // Tres espacios por día
  );



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



