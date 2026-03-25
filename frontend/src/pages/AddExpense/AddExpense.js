import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addExpense } from '../../services/api';
import './AddExpense.css';

const AddExpense = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    name: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const expenseCategories = [
    { value: 'Food', icon: '🍔' },
    { value: 'Transport', icon: '🚗' },
    { value: 'Shopping', icon: '🛍️' },
    { value: 'Bills', icon: '📄' },
    { value: 'Entertainment', icon: '🎮' },
    { value: 'Healthcare', icon: '🏥' },
    { value: 'Education', icon: '📚' },
    { value: 'Travel', icon: '✈️' },
    { value: 'Others', icon: '📦' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      category: category,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!formData.name.trim()) {
      setError('Please enter expense name');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    try {
      setLoading(true);
      
      await addExpense(formData);
      
      console.log('Expense added:', formData);
      
      setSuccess(true);
      setFormData({
        amount: '',
        name: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError('Failed to add expense. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-expense fade-in">
      <div className="page-header">
        <h1>💸 Add Expense</h1>
        <p>Track your spending and expenses</p>
      </div>

      <div className="form-container">
        <div className="card">
          {success && (
            <div className="alert alert-success">
              ✅ Expense added successfully! Redirecting to dashboard...
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Expense Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Grocery Shopping"
                    required
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="amount">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    className="form-control"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <div className="category-grid">
                {expenseCategories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    className={`category-btn ${formData.category === cat.value ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(cat.value)}
                  >
                    <span className="category-icon">{cat.icon}</span>
                    <span className="category-name">{cat.value}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="date">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add any notes or details..."
                rows="4"
              ></textarea>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-warning"
                disabled={loading}
              >
                {loading ? 'Adding...' : '💸 Add Expense'}
              </button>
            </div>
          </form>
        </div>

        {/* Recent Expenses Preview */}
        <div className="card mt-4">
          <div className="card-header">Recent Expenses</div>
          <div className="recent-entries">
            <div className="entry-item">
              <div className="entry-icon">🍔</div>
              <div className="entry-details">
                <div className="entry-name">Grocery Shopping</div>
                <div className="entry-meta">
                  <span className="badge badge-warning">Food</span>
                  <span className="entry-date">2026-02-13</span>
                </div>
              </div>
              <div className="entry-amount expense">-₹3,500</div>
            </div>
            <div className="entry-item">
              <div className="entry-icon">📄</div>
              <div className="entry-details">
                <div className="entry-name">Electricity Bill</div>
                <div className="entry-meta">
                  <span className="badge badge-warning">Bills</span>
                  <span className="entry-date">2026-02-12</span>
                </div>
              </div>
              <div className="entry-amount expense">-₹1,200</div>
            </div>
            <div className="entry-item">
              <div className="entry-icon">🚗</div>
              <div className="entry-details">
                <div className="entry-name">Fuel</div>
                <div className="entry-meta">
                  <span className="badge badge-warning">Transport</span>
                  <span className="entry-date">2026-02-10</span>
                </div>
              </div>
              <div className="entry-amount expense">-₹2,000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
