import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTracker } from '../context/TrackerContext';
import { Moon, Sun, LogOut, Activity } from 'lucide-react';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { clearMeals } = useTracker();

  const handleLogout = () => {
    clearMeals();
    logout();
  };

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo-container">
          <Activity className="logo-icon" size={28} />
          <span className="logo-text">SmartCal</span>
        </div>
        
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>Dashboard</NavLink>
          <NavLink to="/add-meal" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Add Meal</NavLink>
          <NavLink to="/add-activity" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Add Activity</NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Profile</NavLink>
        </nav>

        <div className="header-actions">
          <button onClick={toggleTheme} className="icon-btn theme-toggle" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <button onClick={handleLogout} className="icon-btn logout-btn" aria-label="Logout" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
