import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { Activity, ArrowRight, HeartPulse, ShieldCheck, Zap } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    goal: 'maintain' // default
  });
  const { login } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.weight || !formData.height) {
      alert("Please fill in all fields.");
      return;
    }

    login({
      name: formData.name,
      age: Number(formData.age),
      weight: Number(formData.weight),
      height: Number(formData.height),
      goal: formData.goal
    });
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-brand">
            <Activity size={32} className="brand-icon" />
            <span>SmartCal</span>
          </div>
          
          <div className="login-hero-text">
            <h1>Track smarter, <br/><span className="text-gradient">live healthier.</span></h1>
            <p>Your personalized journey to better health starts here. We calculate your optimal daily intake and help you stay on track.</p>
          </div>
          
          <div className="login-features">
            <div className="feature-item">
              <HeartPulse size={24} className="feature-icon" />
              <span>Personalized BMI tracking</span>
            </div>
            <div className="feature-item">
              <Zap size={24} className="feature-icon" />
              <span>Dynamic calorie goals</span>
            </div>
            <div className="feature-item">
              <ShieldCheck size={24} className="feature-icon" />
              <span>Privacy first, stored locally</span>
            </div>
          </div>
        </div>
        
        {/* Animated background blobs */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <div className="form-header">
            <h2>Get Started</h2>
            <p>Tell us a bit about yourself to personalize your experience.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <Input 
              label="What's your name?" 
              id="name" 
              placeholder="e.g. Alex" 
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
            
            <div className="input-row">
              <Input 
                label="Age (years)" 
                id="age" 
                type="number" 
                placeholder="25" 
                value={formData.age}
                onChange={handleChange}
                min="1"
                required
              />
              <Input 
                label="Weight (kg)" 
                id="weight" 
                type="number" 
                placeholder="70" 
                value={formData.weight}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
            
            <Input 
              label="Height (cm)" 
              id="height" 
              type="number" 
              placeholder="175" 
              value={formData.height}
              onChange={handleChange}
              min="50"
              required
            />
            
            <div className="goal-selection mt-4">
              <label className="input-label">What is your goal?</label>
              <div className="goal-buttons">
                <button type="button" className={`goal-btn ${formData.goal === 'lose' ? 'active' : ''}`} onClick={() => setGoal('lose')}>Lose Weight</button>
                <button type="button" className={`goal-btn ${formData.goal === 'maintain' ? 'active' : ''}`} onClick={() => setGoal('maintain')}>Maintain</button>
                <button type="button" className={`goal-btn ${formData.goal === 'gain' ? 'active' : ''}`} onClick={() => setGoal('gain')}>Gain Weight</button>
              </div>
            </div>
            
            <Button type="submit" size="lg" fullWidth className="submit-btn mt-4">
              <span>Start Tracking</span>
              <ArrowRight size={20} />
            </Button>
          </form>
          
          <div className="form-footer">
            By continuing, you agree to store data locally on your device.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
