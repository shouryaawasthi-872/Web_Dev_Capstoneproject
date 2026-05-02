import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { User, Activity, Edit2 } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    age: user.age,
    weight: user.weight,
    height: user.height,
    goal: user.goal || 'maintain'
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const setGoal = (goal) => {
    setFormData((prev) => ({ ...prev, goal }));
  };

  const handleSave = () => {
    updateProfile({
      age: Number(formData.age),
      weight: Number(formData.weight),
      height: Number(formData.height),
      goal: formData.goal
    });
    setIsEditing(false);
  };

  // Interpret BMI
  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'var(--secondary)' };
    if (bmi >= 18.5 && bmi <= 24.9) return { label: 'Normal weight', color: 'var(--secondary)' };
    if (bmi >= 25 && bmi <= 29.9) return { label: 'Overweight', color: '#f59e0b' };
    return { label: 'Obese', color: 'var(--danger)' };
  };

  const bmiCategory = getBmiCategory(Number(user.bmi));

  return (
    <div className="container page-container profile-page">
      <div className="page-header">
        <h1>Your Profile</h1>
        <p>Manage your personal information and goals.</p>
      </div>

      <div className="profile-content">
        <Card className="profile-info-card">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <h2>{user.name}</h2>
          
          {isEditing ? (
            <div className="edit-goal-section" style={{ width: '100%', marginBottom: '1.5rem', padding: '0 1rem' }}>
              <span className="metric-label" style={{ display: 'block', marginBottom: '0.5rem', textAlign: 'center' }}>Fitness Goal</span>
              <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-color)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <button type="button" style={{ flex: 1, padding: '0.5rem', background: formData.goal === 'lose' ? 'var(--surface-color)' : 'transparent', color: formData.goal === 'lose' ? 'var(--primary)' : 'var(--text-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: formData.goal === 'lose' ? 600 : 500, boxShadow: formData.goal === 'lose' ? 'var(--shadow-sm)' : 'none' }} onClick={() => setGoal('lose')}>Lose</button>
                <button type="button" style={{ flex: 1, padding: '0.5rem', background: formData.goal === 'maintain' ? 'var(--surface-color)' : 'transparent', color: formData.goal === 'maintain' ? 'var(--primary)' : 'var(--text-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: formData.goal === 'maintain' ? 600 : 500, boxShadow: formData.goal === 'maintain' ? 'var(--shadow-sm)' : 'none' }} onClick={() => setGoal('maintain')}>Maintain</button>
                <button type="button" style={{ flex: 1, padding: '0.5rem', background: formData.goal === 'gain' ? 'var(--surface-color)' : 'transparent', color: formData.goal === 'gain' ? 'var(--primary)' : 'var(--text-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: formData.goal === 'gain' ? 600 : 500, boxShadow: formData.goal === 'gain' ? 'var(--shadow-sm)' : 'none' }} onClick={() => setGoal('gain')}>Gain</button>
              </div>
            </div>
          ) : (
            <div className="current-goal-badge" style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem', borderRadius: '2rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.875rem' }}>
              Goal: <span style={{ color: 'var(--primary)', fontWeight: 600, textTransform: 'capitalize' }}>{user.goal || 'Maintain'} Weight</span>
            </div>
          )}

          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-label">Age</span>
              {isEditing ? (
                <Input id="age" type="number" value={formData.age} onChange={handleChange} />
              ) : (
                <span className="metric-value">{user.age} yrs</span>
              )}
            </div>
            <div className="metric-item">
              <span className="metric-label">Weight</span>
              {isEditing ? (
                <Input id="weight" type="number" value={formData.weight} onChange={handleChange} />
              ) : (
                <span className="metric-value">{user.weight} kg</span>
              )}
            </div>
            <div className="metric-item">
              <span className="metric-label">Height</span>
              {isEditing ? (
                <Input id="height" type="number" value={formData.height} onChange={handleChange} />
              ) : (
                <span className="metric-value">{user.height} cm</span>
              )}
            </div>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <div className="edit-actions">
                <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleSave}>Save Changes</Button>
              </div>
            ) : (
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                <Edit2 size={16} style={{marginRight: '8px'}} /> Edit Profile
              </Button>
            )}
          </div>
        </Card>

        <Card className="bmi-card">
          <div className="bmi-header">
            <Activity size={24} className="bmi-icon" />
            <h3>Body Mass Index (BMI)</h3>
          </div>
          
          <div className="bmi-display">
            <div className="bmi-value" style={{ color: bmiCategory.color }}>
              {user.bmi}
            </div>
            <div className="bmi-category" style={{ backgroundColor: `${bmiCategory.color}20`, color: bmiCategory.color }}>
              {bmiCategory.label}
            </div>
          </div>

          <div className="bmi-scale">
            <div className="bmi-segment" style={{ backgroundColor: '#10b981', flex: 18.5 }} title="Underweight (<18.5)"></div>
            <div className="bmi-segment" style={{ backgroundColor: '#10b981', flex: 6.4 }} title="Normal (18.5-24.9)"></div>
            <div className="bmi-segment" style={{ backgroundColor: '#f59e0b', flex: 5 }} title="Overweight (25-29.9)"></div>
            <div className="bmi-segment" style={{ backgroundColor: '#ef4444', flex: 10 }} title="Obese (>30)"></div>
            {/* Visual marker for current BMI */}
            <div 
              className="bmi-marker" 
              style={{ left: `${Math.min(100, Math.max(0, (Number(user.bmi) / 40) * 100))}%` }}
            ></div>
          </div>
          <p className="bmi-description">
            Your daily calorie goal is estimated to be <strong>{user.dailyGoal} kcal</strong> based on your profile to maintain your current weight.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
