import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTracker } from '../context/TrackerContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { Search, Plus, Activity } from 'lucide-react';
import './AddActivity.css';

// Mock exercise database (calories burned per minute for an average 70kg person)
const exerciseDatabase = [
  { id: 1, name: 'Running (Moderate)', caloriesPerMin: 11.4 },
  { id: 2, name: 'Walking (Brisk)', caloriesPerMin: 4.3 },
  { id: 3, name: 'Cycling (Moderate)', caloriesPerMin: 8.5 },
  { id: 4, name: 'Swimming (Freestyle)', caloriesPerMin: 9.8 },
  { id: 5, name: 'Weightlifting (General)', caloriesPerMin: 3.5 },
  { id: 6, name: 'Yoga (Hatha)', caloriesPerMin: 2.5 },
  { id: 7, name: 'HIIT Workout', caloriesPerMin: 12.5 },
  { id: 8, name: 'Jumping Rope', caloriesPerMin: 14.0 },
  { id: 9, name: 'Basketball', caloriesPerMin: 9.3 },
  { id: 10, name: 'Tennis', caloriesPerMin: 8.0 }
];

const AddActivity = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [duration, setDuration] = useState(30); // default 30 mins
  const { addActivity } = useTracker();
  const navigate = useNavigate();

  const filteredExercises = exerciseDatabase.filter(ex => 
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddActivity = (exercise) => {
    const totalBurned = Math.round(exercise.caloriesPerMin * duration);
    addActivity({
      name: exercise.name,
      duration: Number(duration),
      caloriesBurned: totalBurned
    });
    navigate('/');
  };

  return (
    <div className="container page-container add-activity-page">
      <div className="page-header">
        <h1>Log Activity</h1>
        <p>Track your workouts to increase your daily calorie allowance.</p>
      </div>

      <Card className="add-activity-controls">
        <div className="duration-selector">
          <Input 
            label="Duration (minutes)" 
            id="duration" 
            type="number" 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)}
            min="1"
          />
        </div>

        <div className="search-container">
          <Input 
            label="Search Exercise"
            id="search"
            placeholder="Type to search (e.g., Running)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="search-icon" size={20} />
        </div>
      </Card>

      <div className="exercise-results">
        <h3>Exercises</h3>
        {filteredExercises.length > 0 ? (
          <div className="exercise-grid">
            {filteredExercises.map(exercise => (
              <Card key={exercise.id} className="exercise-card">
                <div className="exercise-card-info">
                  <div className="exercise-name-row">
                    <Activity size={18} className="exercise-icon" />
                    <h4>{exercise.name}</h4>
                  </div>
                  <span className="exercise-calories">
                    Est. burn: {Math.round(exercise.caloriesPerMin * duration)} kcal for {duration} min
                  </span>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleAddActivity(exercise)}
                  className="add-btn"
                >
                  <Plus size={16} /> Log
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="empty-results">
            <p>No exercises found matching "{searchTerm}"</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AddActivity;
