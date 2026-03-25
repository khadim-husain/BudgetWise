import React, { useState, useEffect } from 'react';
import './AIAdvisor.css';

const AIAdvisor = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [insights, setInsights] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAISuggestions();
  }, []);

  const fetchAISuggestions = async () => {
    try {
      setLoading(true);
      
      // Mock AI suggestions - replace with actual AI/ML API
      const mockInsights = {
        spendingPattern: 'increasing',
        topCategory: 'Shopping',
        savingsRate: 35,
        riskLevel: 'medium',
      };

      const mockSuggestions = [
        {
          id: 1,
          type: 'warning',
          category: 'Shopping',
          title: 'Shopping Expenses Are High',
          message: 'Your shopping expenses have increased by 40% this month. Consider reviewing your purchases and reducing unnecessary shopping.',
          impact: 'high',
          icon: '🛍️',
        },
        {
          id: 2,
          type: 'success',
          category: 'Food',
          title: 'Great Control on Food Spending',
          message: 'You\'ve stayed within your food budget for 3 consecutive months! Keep up the good work.',
          impact: 'medium',
          icon: '🍔',
        },
        {
          id: 3,
          type: 'info',
          category: 'Transport',
          title: 'Consider Public Transport',
          message: 'Based on your transport expenses, switching to public transport for daily commute could save you ₹3,000/month.',
          impact: 'medium',
          icon: '🚗',
        },
        {
          id: 4,
          type: 'warning',
          category: 'Entertainment',
          title: 'Entertainment Budget Exceeded',
          message: 'You\'ve spent 100% of your entertainment budget. Consider free alternatives like parks, libraries, or community events.',
          impact: 'low',
          icon: '🎮',
        },
        {
          id: 5,
          type: 'success',
          category: 'Bills',
          title: 'Bills Paid On Time',
          message: 'All your bills are paid on time. This helps maintain a good credit score and avoids late fees.',
          impact: 'medium',
          icon: '📄',
        },
      ];

      setInsights(mockInsights);
      setSuggestions(mockSuggestions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
      setLoading(false);
    }
  };

  const getSuggestionClass = (type) => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      default:
        return '';
    }
  };

  const getImpactBadge = (impact) => {
    const badges = {
      high: { text: 'High Impact', class: 'badge-danger' },
      medium: { text: 'Medium Impact', class: 'badge-warning' },
      low: { text: 'Low Impact', class: 'badge-info' },
    };
    return badges[impact] || badges.low;
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="ai-advisor fade-in">
      <div className="page-header">
        <h1>🤖 AI Financial Advisor</h1>
        <p>Personalized insights and recommendations based on your spending patterns</p>
      </div>

      {/* Insights Overview */}
      <div className="row insights-overview">
        <div className="col-3">
          <div className="insight-card">
            <div className="insight-icon">📈</div>
            <div className="insight-content">
              <h4>Spending Trend</h4>
              <p className={insights.spendingPattern === 'increasing' ? 'trend-up' : 'trend-down'}>
                {insights.spendingPattern === 'increasing' ? '↑ Increasing' : '↓ Decreasing'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-3">
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <h4>Top Category</h4>
              <p>{insights.topCategory}</p>
            </div>
          </div>
        </div>
        
        <div className="col-3">
          <div className="insight-card">
            <div className="insight-icon">💰</div>
            <div className="insight-content">
              <h4>Savings Rate</h4>
              <p className="savings-rate">{insights.savingsRate}%</p>
            </div>
          </div>
        </div>
        
        <div className="col-3">
          <div className="insight-card">
            <div className="insight-icon">⚠️</div>
            <div className="insight-content">
              <h4>Risk Level</h4>
              <p className={`risk-${insights.riskLevel}`}>
                {insights.riskLevel.charAt(0).toUpperCase() + insights.riskLevel.slice(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              Personalized Recommendations
              <button className="btn btn-sm btn-primary" onClick={fetchAISuggestions}>
                🔄 Refresh
              </button>
            </div>
            
            <div className="suggestions-list">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className={`suggestion-item ${getSuggestionClass(suggestion.type)}`}>
                  <div className="suggestion-icon">{suggestion.icon}</div>
                  <div className="suggestion-content">
                    <div className="suggestion-header">
                      <h4>{suggestion.title}</h4>
                      <span className={`badge ${getImpactBadge(suggestion.impact).class}`}>
                        {getImpactBadge(suggestion.impact).text}
                      </span>
                    </div>
                    <p>{suggestion.message}</p>
                    <div className="suggestion-meta">
                      <span className="category-tag">{suggestion.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Tips */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card tips-section">
            <div className="card-header">💡 General Financial Tips</div>
            <div className="tips-grid">
              <div className="tip-card">
                <h4>🎯 50/30/20 Rule</h4>
                <p>Allocate 50% to needs, 30% to wants, and 20% to savings and debt repayment.</p>
              </div>
              <div className="tip-card">
                <h4>💰 Emergency Fund</h4>
                <p>Aim to save 3-6 months of expenses for unexpected situations.</p>
              </div>
              <div className="tip-card">
                <h4>📊 Track Everything</h4>
                <p>Record all expenses, no matter how small. Small purchases add up!</p>
              </div>
              <div className="tip-card">
                <h4>🔄 Automate Savings</h4>
                <p>Set up automatic transfers to savings account right after payday.</p>
              </div>
              <div className="tip-card">
                <h4>🛒 Smart Shopping</h4>
                <p>Make a list before shopping and stick to it. Avoid impulse purchases.</p>
              </div>
              <div className="tip-card">
                <h4>💳 Limit Credit Use</h4>
                <p>Use credit cards wisely and pay off balances in full each month.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card action-section">
            <div className="card-header">Take Action</div>
            <div className="action-buttons">
              <button className="btn btn-success">
                <span>📊</span> View Detailed Analysis
              </button>
              <button className="btn btn-primary">
                <span>🎯</span> Set Financial Goals
              </button>
              <button className="btn btn-warning">
                <span>📈</span> Get Budget Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
