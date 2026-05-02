import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTracker } from '../context/TrackerContext';
import Card from '../components/Card';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Flame, Utensils, Zap, TrendingUp, Activity } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { getMealsByDate, getActivitiesByDate } = useTracker();
  
  const today = new Date().toISOString().split('T')[0];
  const todaysMeals = getMealsByDate(today);
  const todaysActivities = getActivitiesByDate(today);

  const caloriesConsumed = todaysMeals.reduce((acc, meal) => acc + meal.calories, 0);
  const caloriesBurned = todaysActivities.reduce((acc, act) => acc + act.caloriesBurned, 0);
  
  // Remaining = Goal - Consumed + Burned
  const remainingCalories = Math.max(0, user.dailyGoal - caloriesConsumed + caloriesBurned);
  
  // Adjusted Goal for pie chart to reflect increased allowance
  const adjustedGoal = user.dailyGoal + caloriesBurned;
  const progressPercentage = Math.min(100, (caloriesConsumed / adjustedGoal) * 100);

  // Group meals by type for the bar chart
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
  const caloriesByType = mealTypes.map(type => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    calories: todaysMeals.filter(m => m.type === type).reduce((acc, m) => acc + m.calories, 0)
  }));

  // Pie chart data
  const pieData = [
    { name: 'Consumed', value: caloriesConsumed },
    { name: 'Remaining', value: remainingCalories }
  ];
  const COLORS = ['var(--primary)', 'var(--border-color)'];

  return (
    <div className="container page-container dashboard-page">
      <div className="dashboard-header">
        <h1>Hello, {user.name.split(' ')[0]}! 👋</h1>
        <p>Here's your calorie summary for today.</p>
        <div className="current-goal-badge" style={{ marginTop: '0.5rem', display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '1rem', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Current Goal: <span style={{ color: 'var(--primary)', fontWeight: 600, textTransform: 'capitalize' }}>{user.goal || 'Maintain'} Weight</span>
        </div>
      </div>

      <div className="summary-cards">
        <Card className="summary-card stat-card">
          <div className="stat-icon-wrapper goal-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Daily Goal</p>
            <h2 className="stat-value">{user.dailyGoal} <span className="stat-unit">kcal</span></h2>
          </div>
        </Card>

        <Card className="summary-card stat-card highlight">
          <div className="stat-icon-wrapper consumed-icon">
            <Utensils size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Consumed</p>
            <h2 className="stat-value">{caloriesConsumed} <span className="stat-unit">kcal</span></h2>
          </div>
        </Card>

        <Card className="summary-card stat-card burned-card" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }}>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
            <Flame size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label" style={{ color: 'white' }}>Burned</p>
            <h2 className="stat-value" style={{ color: 'white' }}>{caloriesBurned} <span className="stat-unit" style={{ color: 'white' }}>kcal</span></h2>
          </div>
        </Card>

        <Card className="summary-card stat-card">
          <div className="stat-icon-wrapper remaining-icon">
            <Zap size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Remaining</p>
            <h2 className="stat-value">{remainingCalories} <span className="stat-unit">kcal</span></h2>
          </div>
        </Card>
      </div>

      <div className="charts-section">
        <Card className="chart-card">
          <h3>Progress Breakdown</h3>
          <div className="pie-chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--surface-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)'
                  }} 
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-center-label">
              <span className="percent">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </Card>

        <Card className="chart-card">
          <h3>Calories by Meal</h3>
          <div className="bar-chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={caloriesByType} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
                <RechartsTooltip
                  cursor={{ fill: 'var(--border-color)', opacity: 0.4 }}
                  contentStyle={{ 
                    backgroundColor: 'var(--surface-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)'
                  }}
                />
                <Bar dataKey="calories" fill="var(--secondary)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="recent-meals-section">
        <div className="section-header">
          <h2>Today's Log</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Meals</h3>
            {todaysMeals.length === 0 ? (
              <Card className="empty-state">
                <Utensils size={40} className="empty-icon" />
                <p>No meals added.</p>
              </Card>
            ) : (
              <div className="meals-list">
                {todaysMeals.map(meal => (
                  <Card key={meal.id} className="meal-item" style={{ padding: '0.75rem 1rem' }}>
                    <div className="meal-info">
                      <div className={`meal-type-indicator type-${meal.type}`}></div>
                      <div>
                        <h4>{meal.name}</h4>
                        <span className="meal-type-label">{meal.type}</span>
                      </div>
                    </div>
                    <div className="meal-calories">
                      <span>{meal.calories} kcal</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Activities</h3>
            {todaysActivities.length === 0 ? (
              <Card className="empty-state">
                <Activity size={40} className="empty-icon" />
                <p>No activities added.</p>
              </Card>
            ) : (
              <div className="meals-list">
                {todaysActivities.map(act => (
                  <Card key={act.id} className="meal-item" style={{ padding: '0.75rem 1rem' }}>
                    <div className="meal-info">
                      <Activity size={20} style={{ color: 'var(--secondary)' }} />
                      <div>
                        <h4>{act.name}</h4>
                        <span className="meal-type-label">{act.duration} mins</span>
                      </div>
                    </div>
                    <div className="meal-calories" style={{ color: 'var(--secondary)' }}>
                      <span>{act.caloriesBurned} kcal</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
