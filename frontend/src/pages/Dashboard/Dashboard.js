import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { getTransactions, getFinancialSummary } from '../../services/api';
import './Dashboard.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  const buildCategoryBreakdown = (transactions) => {
    return transactions
      .filter((transaction) => transaction.type?.toUpperCase() === 'EXPENSE')
      .reduce((accumulator, transaction) => {
        const amount = Number(transaction.amount) || 0;
        const category = transaction.category || 'Others';
        accumulator[category] = (accumulator[category] || 0) + amount;
        return accumulator;
      }, {});
  };

  const buildMonthlyTrendData = (transactions) => {
    const monthlyMap = transactions.reduce((accumulator, transaction) => {
      const monthKey = new Date(transaction.date).toISOString().slice(0, 7);

      if (!accumulator[monthKey]) {
        accumulator[monthKey] = { income: 0, expenses: 0 };
      }

      const amount = Number(transaction.amount) || 0;
      if (transaction.type?.toUpperCase() === 'INCOME') {
        accumulator[monthKey].income += amount;
      } else {
        accumulator[monthKey].expenses += amount;
      }

      return accumulator;
    }, {});

    return Object.keys(monthlyMap)
      .sort()
      .map((monthKey) => ({
        month: new Date(`${monthKey}-01`).toLocaleString('default', { month: 'short' }),
        income: monthlyMap[monthKey].income,
        expenses: monthlyMap[monthKey].expenses,
      }));
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [summaryData, transactions] = await Promise.all([
        getFinancialSummary(),
        getTransactions(),
      ]);

      setSummary({
        totalIncome: summaryData.totalIncome || 0,
        totalExpenses: summaryData.totalExpenses || 0,
        balance: summaryData.balance || 0,
      });

      const normalizedTransactions = transactions.map((transaction) => ({
        ...transaction,
        amount: Number(transaction.amount) || 0,
      }));

      const sortedTransactions = normalizedTransactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map(t => ({
          id: t.id,
          date: t.date,
          name: t.name,
          amount: t.amount,
          type: t.type.toLowerCase(),
          category: t.category,
        }));
      setRecentTransactions(sortedTransactions);

      const categoryBreakdown = Object.keys(summaryData.expensesByCategory || {}).length > 0
        ? summaryData.expensesByCategory
        : buildCategoryBreakdown(normalizedTransactions);
      setCategoryData(categoryBreakdown);

      const monthlyTrendData = buildMonthlyTrendData(normalizedTransactions);
      if (monthlyTrendData.length > 0) {
        setTrendData(monthlyTrendData);
      } else {
        const currentMonth = new Date().toLocaleString('default', { month: 'short' });
        setTrendData([
          { month: currentMonth, income: summaryData.totalIncome || 0, expenses: summaryData.totalExpenses || 0 },
        ]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setSummary({ totalIncome: 0, totalExpenses: 0, balance: 0 });
      setRecentTransactions([]);
      setCategoryData({});
      setTrendData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const categoryLabels = Object.keys(categoryData);
  const categoryValues = Object.values(categoryData);
  const hasExpenseData = categoryValues.some((value) => Number(value) > 0);
  const categoryColors = [
    'rgba(239, 68, 68, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(59, 130, 246, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(236, 72, 153, 0.8)',
  ];

  // Chart configurations
  const doughnutChartData = {
    labels: hasExpenseData ? categoryLabels : ['No expense data'],
    datasets: [
      {
        label: 'Expenses',
        data: hasExpenseData ? categoryValues : [1],
        backgroundColor: hasExpenseData ? categoryColors : ['rgba(203, 213, 225, 0.8)'],
        borderWidth: 0,
      },
    ],
  };

  const lineChartData = {
    labels: trendData.map(d => d.month),
    datasets: [
      {
        label: 'Income',
        data: trendData.map(d => d.income),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expenses',
        data: trendData.map(d => d.expenses),
        borderColor: 'rgba(245, 158, 11, 1)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const lineChartOptions = {
    ...chartOptions,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const savingsRate = summary.totalIncome > 0 
    ? ((summary.balance / summary.totalIncome) * 100).toFixed(1) 
    : 0;

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Financial Overview</h1>
          <p className="dashboard-subtitle">Track your income, expenses, and savings</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-card-income">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Income</p>
            <h3 className="stat-value">₹{summary.totalIncome.toLocaleString()}</h3>
          </div>
        </div>

        <div className="stat-card stat-card-expense">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Expenses</p>
            <h3 className="stat-value">₹{summary.totalExpenses.toLocaleString()}</h3>
          </div>
        </div>

        <div className="stat-card stat-card-balance">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h18v18H3zM21 9H3M9 21V9"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Balance</p>
            <h3 className="stat-value">₹{summary.balance.toLocaleString()}</h3>
          </div>
        </div>

        <div className="stat-card stat-card-savings">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Savings Rate</p>
            <h3 className="stat-value">{savingsRate}%</h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-title">Spending by Category</h3>
          </div>
          <div className="chart-container">
            <Doughnut data={doughnutChartData} options={chartOptions} />
          </div>
          <div className="chart-legend">
            {!hasExpenseData && (
              <div className="legend-item">
                <span className="legend-label">No expenses recorded yet. Add an expense to see category split.</span>
              </div>
            )}
            {hasExpenseData && Object.entries(categoryData).map(([category, amount], index) => (
              <div key={category} className="legend-item">
                <span 
                  className="legend-color" 
                  style={{ 
                    backgroundColor: doughnutChartData.datasets[0].backgroundColor[index] 
                  }}
                ></span>
                <span className="legend-label">{category}</span>
                <span className="legend-value">₹{amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-title">Income vs Expenses Trend</h3>
          </div>
          <div className="chart-container">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="transactions-card">
        <div className="transactions-header">
          <h3 className="transactions-title">Recent Transactions</h3>
          <Link to="/reports" className="view-all-link">
            View All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        <div className="transactions-list">
          {recentTransactions.length === 0 && (
            <div className="transaction-item">
              <div className="transaction-details">
                <p className="transaction-name">No transactions yet</p>
                <div className="transaction-meta">
                  <span className="transaction-category">Add income or expense to get started.</span>
                </div>
              </div>
            </div>
          )}
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className={`transaction-icon ${transaction.type}`}>
                {transaction.type === 'income' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M19 12l-7 7-7-7"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 19V5M5 12l7-7 7 7"/>
                  </svg>
                )}
              </div>
              <div className="transaction-details">
                <p className="transaction-name">{transaction.name}</p>
                <div className="transaction-meta">
                  <span className="transaction-category">{transaction.category}</span>
                  <span className="transaction-date">{transaction.date}</span>
                </div>
              </div>
              <div className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/add-income" className="action-btn action-btn-income">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add Income
        </Link>
        <Link to="/add-expense" className="action-btn action-btn-expense">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 12H4"/>
          </svg>
          Add Expense
        </Link>
        <Link to="/budget" className="action-btn action-btn-budget">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          Budget
        </Link>
        <Link to="/ai-advisor" className="action-btn action-btn-ai">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
          AI Advisor
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
