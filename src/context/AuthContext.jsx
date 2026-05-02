import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (userData) => {
    // Basic calculation for BMI: weight(kg) / height(m)^2
    const heightInMeters = userData.height / 100;
    const bmi = (userData.weight / (heightInMeters * heightInMeters)).toFixed(1);
    
    // Basic calculation for daily calorie needs (Mifflin-St Jeor Equation)
    const bmr = (10 * userData.weight) + (6.25 * userData.height) - (5 * userData.age) - 78;
    let dailyGoal = Math.round(bmr * 1.2); // Sedentary multiplier (maintenance)

    // Adjust based on goal
    if (userData.goal === 'lose') {
      dailyGoal -= 500; // Deficit
    } else if (userData.goal === 'gain') {
      dailyGoal += 500; // Surplus
    }

    setUser({
      ...userData,
      bmi,
      dailyGoal
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (newData) => {
    login({ ...user, ...newData });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
