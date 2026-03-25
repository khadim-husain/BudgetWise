import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addIncome } from '../../services/api';
import './AddIncome.css';

const AddIncome = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const incomeSources = [
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Rental',
    'Gift',
    'Bonus',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.name || formData.name.trim() === '') {
      setError('Please enter an income name');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!formData.category) {
      setError('Please select an income category');
      return;
    }

    try {
      setLoading(true);

      await addIncome({
        name: formData.name.trim(),
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description.trim(),
      });
      
      console.log('Income added:', formData);
      
      setSuccess(true);
      setFormData({
        name: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add income. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-income fade-in">
      <div className="page-header">
        <h1>💰 Add Income</h1>
        <p>Record your income transactions</p>
      </div>

      <div className="form-container">
        <div className="card">
          {success && (
            <div className="alert alert-success">
              ✅ Income added successfully! Redirecting to dashboard...
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Income Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Monthly Salary, Freelance Project"
                required
              />
            </div>

            <div className="row">
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

              <div className="col-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="category">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    {incomeSources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>
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
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? 'Adding...' : '💰 Add Income'}
              </button>
            </div>
          </form>
        </div>

        {/* Recent Income Preview */}
        <div className="card mt-4">
          <div className="card-header">Recent Income Entries</div>
          <div className="recent-entries">
            <div className="entry-item">
              <div className="entry-icon">💰</div>
              <div className="entry-details">
                <div className="entry-source">Salary</div>
                <div className="entry-date">2026-02-01</div>
              </div>
              <div className="entry-amount">+₹50,000</div>
            </div>
            <div className="entry-item">
              <div className="entry-icon">💰</div>
              <div className="entry-details">
                <div className="entry-source">Freelance</div>
                <div className="entry-date">2026-01-28</div>
              </div>
              <div className="entry-amount">+₹15,000</div>
            </div>
            <div className="entry-item">
              <div className="entry-icon">💰</div>
              <div className="entry-details">
                <div className="entry-source">Investment</div>
                <div className="entry-date">2026-01-25</div>
              </div>
              <div className="entry-amount">+₹8,500</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddIncome;
