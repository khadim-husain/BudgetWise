import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle }) => {
  const menuItems = [
    { path: '/', icon: '📊', label: 'Dashboard' },
    { path: '/add-income', icon: '💰', label: 'Add Income' },
    { path: '/add-expense', icon: '💸', label: 'Add Expense' },
    { path: '/budget', icon: '🎯', label: 'Budget' },
    { path: '/reports', icon: '📈', label: 'Reports' },
    { path: '/ai-advisor', icon: '🤖', label: 'AI Advisor' },
    { path: '/forum', icon: '👥', label: 'Community' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">💳</span>
          {isOpen && <span className="logo-text">FinanceTracker</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
            title={!isOpen ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {isOpen && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="toggle-btn" onClick={onToggle} title="Toggle Sidebar">
          {isOpen ? '◀' : '▶'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
