import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { exportToPDF, exportToCSV } from '../../utils/exportUtils';
import { deleteTransaction, getTransactions } from '../../services/api';
import './Reports.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    searchTerm: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    let filtered = [...transactions];

    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(t => t.date >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(t => t.date <= filters.dateTo);
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [filters, transactions]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await getTransactions();
      const normalizedTransactions = response.map((transaction) => ({
        id: transaction.id,
        date: transaction.date,
        name: transaction.name,
        amount: Number(transaction.amount) || 0,
        type: transaction.type?.toLowerCase() || 'expense',
        category: transaction.category,
      }));

      setTransactions(normalizedTransactions);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load transactions.');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };


  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        setTransactions((currentTransactions) => currentTransactions.filter((transaction) => transaction.id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete transaction.');
      }
    }
  };

  const handleExportPDF = () => {
    exportToPDF(filteredTransactions);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredTransactions);
  };

  const categories = [...new Set(transactions.map(t => t.category))];

  // Calculate monthly data for charts
  const monthlyData = transactions.reduce((acc, t) => {
    const month = t.date.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      acc[month].income += t.amount;
    } else {
      acc[month].expense += t.amount;
    }
    return acc;
  }, {});

  const months = Object.keys(monthlyData).sort();
  
  const barChartData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: months.map(m => monthlyData[m].income),
        backgroundColor: '#10b981',
      },
      {
        label: 'Expense',
        data: months.map(m => monthlyData[m].expense),
        backgroundColor: '#f59e0b',
      },
    ],
  };

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: 'Net Savings',
        data: months.map(m => monthlyData[m].income - monthlyData[m].expense),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="reports fade-in">
      <div className="page-header">
        <h1>📈 Financial Reports</h1>
        <p>View and analyze your financial transactions</p>
      </div>

      {error && (
        <div className="alert alert-danger">
          ❌ {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="row summary-cards">
        <div className="col-4">
          <div className="card summary-card income-card">
            <div className="card-content">
              <h3>Total Income</h3>
              <p className="amount">₹{totalIncome.toLocaleString()}</p>
              <span className="badge badge-success">{filteredTransactions.filter(t => t.type === 'income').length} transactions</span>
            </div>
          </div>
        </div>
        
        <div className="col-4">
          <div className="card summary-card expense-card">
            <div className="card-content">
              <h3>Total Expenses</h3>
              <p className="amount">₹{totalExpense.toLocaleString()}</p>
              <span className="badge badge-warning">{filteredTransactions.filter(t => t.type === 'expense').length} transactions</span>
            </div>
          </div>
        </div>
        
        <div className="col-4">
          <div className="card summary-card balance-card">
            <div className="card-content">
              <h3>Net Balance</h3>
              <p className="amount">₹{(totalIncome - totalExpense).toLocaleString()}</p>
              <span className={`badge ${totalIncome - totalExpense >= 0 ? 'badge-success' : 'badge-danger'}`}>
                {totalIncome - totalExpense >= 0 ? 'Surplus' : 'Deficit'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row mt-4">
        <div className="col-6">
          <div className="card">
            <div className="card-header">Monthly Income vs Expenses</div>
            <div className="chart-container">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </div>
        
        <div className="col-6">
          <div className="card">
            <div className="card-header">Savings Trend</div>
            <div className="chart-container">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Export */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              Transaction History
              <div className="export-buttons">
                <button className="btn btn-sm btn-success" onClick={handleExportCSV}>
                  📄 Export CSV
                </button>
                <button className="btn btn-sm btn-danger" onClick={handleExportPDF}>
                  📑 Export PDF
                </button>
              </div>
            </div>
            
            {/* Filters */}
            <div className="filters-section">
              <div className="row">
                <div className="col-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search transactions..."
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  />
                </div>
                
                <div className="col-2">
                  <select
                    className="form-control"
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                
                <div className="col-2">
                  <select
                    className="form-control"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-2">
                  <input
                    type="date"
                    className="form-control"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    placeholder="From Date"
                  />
                </div>
                
                <div className="col-2">
                  <input
                    type="date"
                    className="form-control"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    placeholder="To Date"
                  />
                </div>
                
                <div className="col-1">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setFilters({ type: 'all', category: 'all', dateFrom: '', dateTo: '', searchTerm: '' })}
                    style={{ width: '100%' }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center" style={{ padding: '2rem' }}>
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.date}</td>
                        <td>{transaction.name}</td>
                        <td>
                          <span className={`badge badge-${transaction.type === 'income' ? 'success' : 'warning'}`}>
                            {transaction.category}
                          </span>
                        </td>
                        <td>
                          <span className={transaction.type === 'income' ? 'type-income' : 'type-expense'}>
                            {transaction.type === 'income' ? '⬇️ Income' : '⬆️ Expense'}
                          </span>
                        </td>
                        <td className={`amount-${transaction.type}`}>
                          {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </td>
                        <td>
                          <button
                            className="btn-icon"
                            onClick={() => handleDelete(transaction.id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
