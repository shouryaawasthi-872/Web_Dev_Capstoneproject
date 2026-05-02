import React, { createContext, useContext, useState, useEffect } from 'react';

const TrackerContext = createContext();

export const TrackerProvider = ({ children }) => {
  const [meals, setMeals] = useState(() => {
    const savedMeals = localStorage.getItem('meals');
    return savedMeals ? JSON.parse(savedMeals) : [];
  });

  const [activities, setActivities] = useState(() => {
    const savedActivities = localStorage.getItem('activities');
    return savedActivities ? JSON.parse(savedActivities) : [];
  });

  useEffect(() => {
    localStorage.setItem('meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  const addMeal = (meal) => {
    setMeals((prev) => [
      ...prev,
      {
        ...meal,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      },
    ]);
  };

  const removeMeal = (id) => {
    setMeals((prev) => prev.filter((meal) => meal.id !== id));
  };

  const addActivity = (activity) => {
    setActivities((prev) => [
      ...prev,
      {
        ...activity,
        id: 'act-' + Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
      },
    ]);
  };

  const clearMeals = () => {
    setMeals([]);
    setActivities([]);
    localStorage.removeItem('meals');
    localStorage.removeItem('activities');
  };

  const getMealsByDate = (date) => {
    return meals.filter((meal) => meal.date === date);
  };

  const getActivitiesByDate = (date) => {
    return activities.filter((activity) => activity.date === date);
  };

  return (
    <TrackerContext.Provider value={{ 
      meals, addMeal, removeMeal, getMealsByDate,
      activities, addActivity, getActivitiesByDate,
      clearMeals 
    }}>
      {children}
    </TrackerContext.Provider>
  );
};

export const useTracker = () => useContext(TrackerContext);
