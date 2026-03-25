import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import AddIncome from './pages/AddIncome/AddIncome';
import AddExpense from './pages/AddExpense/AddExpense';
import Reports from './pages/Reports/Reports';
import AIAdvisor from './pages/AIAdvisor/AIAdvisor';
import BudgetManager from './pages/BudgetManager/BudgetManager';
import Forum from './pages/Forum/Forum';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData, token) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          {!isAuthenticated ? (
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          ) : (
            <Layout user={user} onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/add-income" element={<AddIncome />} />
                <Route path="/add-expense" element={<AddExpense />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/ai-advisor" element={<AIAdvisor />} />
                <Route path="/budget" element={<BudgetManager />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          )}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
