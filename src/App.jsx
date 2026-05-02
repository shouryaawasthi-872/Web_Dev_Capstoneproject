import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TrackerProvider } from './context/TrackerContext';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AddMeal from './pages/AddMeal';
import AddActivity from './pages/AddActivity';
import Profile from './pages/Profile';
import Header from './components/Header';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  const { user } = useAuth();
  return (
    <>
      {user && <Header />}
      {children}
    </>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/add-meal" 
        element={
          <PrivateRoute>
            <AddMeal />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/add-activity" 
        element={
          <PrivateRoute>
            <AddActivity />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TrackerProvider>
          <BrowserRouter>
            <Layout>
              <AppRoutes />
            </Layout>
          </BrowserRouter>
        </TrackerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
