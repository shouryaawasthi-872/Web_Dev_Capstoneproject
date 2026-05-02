import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTracker } from '../context/TrackerContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { Search, Plus } from 'lucide-react';
import './AddMeal.css';

// Mock food database
const foodDatabase = [
  { id: 1, name: 'Apple', calories: 95 },
  { id: 2, name: 'Banana', calories: 105 },
  { id: 3, name: 'Chicken Breast (100g)', calories: 165 },
  { id: 4, name: 'Rice (1 cup)', calories: 205 },
  { id: 5, name: 'Oatmeal (1 cup)', calories: 158 },
  { id: 6, name: 'Eggs (2 large)', calories: 140 },
  { id: 7, name: 'Greek Yogurt (1 cup)', calories: 100 },
  { id: 8, name: 'Salmon (100g)', calories: 208 },
  { id: 9, name: 'Broccoli (1 cup)', calories: 55 },
  { id: 10, name: 'Almonds (1 oz)', calories: 164 },
  { id: 11, name: 'Protein Shake', calories: 120 },
  { id: 12, name: 'Avocado Toast', calories: 250 },
];

const AddMeal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('breakfast');
  const { addMeal } = useTracker();
  const navigate = useNavigate();

  const filteredFoods = foodDatabase.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMeal = (food) => {
    addMeal({
      name: food.name,
      calories: food.calories,
      type: selectedType
    });
    // Optional: Show a toast notification here
    navigate('/');
  };

  return (
    <div className="container page-container add-meal-page">
      <div className="page-header">
        <h1>Add a Meal</h1>
        <p>Search for food and add it to your daily log.</p>
      </div>

      <Card className="add-meal-controls">
        <div className="meal-type-selector">
          <label className="input-label">Meal Type</label>
          <div className="type-buttons">
            {['breakfast', 'lunch', 'dinner', 'snacks'].map(type => (
              <button
                key={type}
                className={`type-btn ${selectedType === type ? 'active' : ''}`}
                onClick={() => setSelectedType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="search-container">
          <Input 
            label="Search Food"
            id="search"
            placeholder="Type to search (e.g., Apple)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="search-icon" size={20} />
        </div>
      </Card>

      <div className="food-results">
        <h3>Results</h3>
        {filteredFoods.length > 0 ? (
          <div className="food-grid">
            {filteredFoods.map(food => (
              <Card key={food.id} className="food-card">
                <div className="food-card-info">
                  <h4>{food.name}</h4>
                  <span className="food-calories">{food.calories} kcal</span>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleAddMeal(food)}
                  className="add-btn"
                >
                  <Plus size={16} /> Add
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="empty-results">
            <p>No foods found matching "{searchTerm}"</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AddMeal;
