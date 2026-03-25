import React, { useState, useEffect } from 'react';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../../services/api';
import './BudgetManager.css';

const BudgetManager = () => {
  const [budgets, setBudgets] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: '',
  });

  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Travel', 'Groceries', 'Others'];

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await getBudgets();
      // Transform backend data to match frontend format
      const transformedBudgets = data.map(b => ({
        id: b.id,
        category: b.category,
        budgetAmount: b.amount,
        spent: b.spent || 0,
        percentage: b.amount > 0 ? (b.spent / b.amount) * 100 : 0,
        month: b.month,
        year: b.year,
        period: b.period,
      }));
      setBudgets(transformedBudgets);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!newBudget.category || !newBudget.amount) return;

    try {
      setLoading(true);
      const currentDate = new Date();
      const budgetData = {
        category: newBudget.category,
        amount: parseFloat(newBudget.amount),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        period: 'MONTHLY',
      };

      await createBudget(budgetData);
      setNewBudget({ category: '', amount: '' });
      await fetchBudgets(); // Refresh the list
    } catch (error) {
      console.error('Error adding budget:', error);
      alert('Failed to add budget. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async (id, amount) => {
    try {
      setLoading(true);
      const budget = budgets.find(b => b.id === id);
      const currentDate = new Date();
      await updateBudget(id, {
        category: budget.category,
        amount: parseFloat(amount),
        month: budget.month || currentDate.getMonth() + 1,
        year: budget.year || currentDate.getFullYear(),
        period: budget.period || 'MONTHLY',
      });
      setEditingId(null);
      await fetchBudgets(); // Refresh the list
    } catch (error) {
      console.error('Error updating budget:', error);
      alert('Failed to update budget. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        setLoading(true);
        await deleteBudget(id);
        await fetchBudgets(); // Refresh the list
      } catch (error) {
        console.error('Error deleting budget:', error);
        alert('Failed to delete budget. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'var(--overspend-color)';
    if (percentage >= 80) return 'var(--warning-color)';
    return 'var(--success-color)';
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="budget-manager fade-in">
      <div className="page-header">
        <h1>🎯 Budget Management</h1>
        <p>Set and track your monthly budgets by category</p>
      </div>

      {/* Budget Summary */}
      <div className="row summary-cards">
        <div className="col-4">
          <div className="card summary-card">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <h3>Total Budget</h3>
              <p className="amount">₹{totalBudget.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="col-4">
          <div className="card summary-card">
            <div className="card-icon">💸</div>
            <div className="card-content">
              <h3>Total Spent</h3>
              <p className="amount">₹{totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="col-4">
          <div className="card summary-card">
            <div className="card-icon">💳</div>
            <div className="card-content">
              <h3>Remaining</h3>
              <p className="amount">₹{totalRemaining.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        {/* Add New Budget */}
        <div className="col-4">
          <div className="card">
            <div className="card-header">Add New Budget</div>
            <form onSubmit={handleAddBudget}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.filter(cat => !budgets.find(b => b.category === cat)).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Monthly Budget (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                  placeholder="Enter amount"
                  min="0"
                  step="100"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {loading ? 'Saving...' : 'Add Budget'}
              </button>
            </form>
          </div>
        </div>

        {/* Budget List */}
        <div className="col-8">
          <div className="card">
            <div className="card-header">Budget Categories</div>
            <div className="budget-list">
              {budgets.length === 0 ? (
                <p className="text-center" style={{ padding: '2rem', color: 'var(--text-secondary)' }}>
                  No budgets set yet. Add your first budget to get started!
                </p>
              ) : (
                budgets.map((budget) => (
                  <div key={budget.id} className="budget-item">
                    <div className="budget-header">
                      <div className="budget-category">
                        <h4>{budget.category}</h4>
                        {editingId === budget.id ? (
                          <input
                            type="number"
                            className="budget-edit-input"
                            defaultValue={budget.budgetAmount}
                            onBlur={(e) => handleUpdateBudget(budget.id, e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdateBudget(budget.id, e.target.value);
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <p className="budget-amount">
                            ₹{budget.spent.toLocaleString()} / ₹{budget.budgetAmount.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="budget-actions">
                        <button
                          className="btn-icon"
                          onClick={() => setEditingId(budget.id)}
                          title="Edit"
                          disabled={loading}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDeleteBudget(budget.id)}
                          title="Delete"
                          disabled={loading}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(budget.percentage, 100)}%`,
                          backgroundColor: getProgressColor(budget.percentage),
                        }}
                      ></div>
                    </div>
                    
                    <div className="budget-stats">
                      <span className={`percentage ${budget.percentage >= 100 ? 'overspent' : ''}`}>
                        {budget.percentage.toFixed(0)}% used
                      </span>
                      <span className="remaining">
                        ₹{(budget.budgetAmount - budget.spent).toLocaleString()} remaining
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Tips */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card tips-card">
            <div className="card-header">💡 Budget Tips</div>
            <div className="tips-grid">
              <div className="tip-item">
                <div className="tip-icon">🎯</div>
                <div className="tip-content">
                  <h4>Set Realistic Goals</h4>
                  <p>Base your budgets on your actual spending patterns, not wishful thinking.</p>
                </div>
              </div>
              <div className="tip-item">
                <div className="tip-icon">📊</div>
                <div className="tip-content">
                  <h4>Review Monthly</h4>
                  <p>Adjust your budgets every month based on your needs and income changes.</p>
                </div>
              </div>
              <div className="tip-item">
                <div className="tip-icon">⚠️</div>
                <div className="tip-content">
                  <h4>Watch Warnings</h4>
                  <p>When a category reaches 80%, it's time to reduce spending in that area.</p>
                </div>
              </div>
              <div className="tip-item">
                <div className="tip-icon">💰</div>
                <div className="tip-content">
                  <h4>Emergency Fund</h4>
                  <p>Always allocate 10-20% of your income to savings and emergencies.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetManager;
