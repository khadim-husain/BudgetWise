import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9090/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (!config.headers) {
      config.headers = {};
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== Authentication APIs ====================
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return { message: 'Logged out successfully' };
};

// ==================== Transaction APIs ====================
export const getTransactions = async (filters = {}) => {
  const response = await api.get('/transactions', { params: filters });
  return response.data;
};

export const getTransactionById = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};

export const getTransactionsByDateRange = async (startDate, endDate) => {
  const response = await api.get('/transactions/date-range', {
    params: { startDate, endDate }
  });
  return response.data;
};

export const addTransaction = async (transactionData) => {
  const response = await api.post('/transactions', transactionData);
  return response.data;
};

export const addIncome = async (incomeData) => {
  const data = { ...incomeData, type: 'INCOME' };
  const response = await api.post('/transactions', data);
  return response.data;
};

export const addExpense = async (expenseData) => {
  const data = { ...expenseData, type: 'EXPENSE' };
  const response = await api.post('/transactions', data);
  return response.data;
};

export const updateTransaction = async (id, data) => {
  const response = await api.put(`/transactions/${id}`, data);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

export const getTotalIncome = async () => {
  const response = await api.get('/transactions/total-income');
  return response.data;
};

export const getTotalExpenses = async () => {
  const response = await api.get('/transactions/total-expenses');
  return response.data;
};

export const getExpensesByCategory = async () => {
  const response = await api.get('/transactions/expenses-by-category');
  return response.data;
};

export const getIncomeByCategory = async () => {
  const response = await api.get('/transactions/income-by-category');
  return response.data;
};

// ==================== Budget APIs ====================
export const getBudgets = async () => {
  const response = await api.get('/budgets');
  return response.data;
};

export const getBudgetById = async (id) => {
  const response = await api.get(`/budgets/${id}`);
  return response.data;
};

export const getBudgetsByPeriod = async (month, year) => {
  const response = await api.get('/budgets/by-period', {
    params: { month, year }
  });
  return response.data;
};

export const createBudget = async (budgetData) => {
  const response = await api.post('/budgets', budgetData);
  return response.data;
};

export const updateBudget = async (id, budgetData) => {
  const response = await api.put(`/budgets/${id}`, budgetData);
  return response.data;
};

export const deleteBudget = async (id) => {
  const response = await api.delete(`/budgets/${id}`);
  return response.data;
};

// ==================== Savings Goal APIs ====================
export const getSavingsGoals = async () => {
  const response = await api.get('/savings-goals');
  return response.data;
};

export const getActiveSavingsGoals = async () => {
  const response = await api.get('/savings-goals/active');
  return response.data;
};

export const getSavingsGoalById = async (id) => {
  const response = await api.get(`/savings-goals/${id}`);
  return response.data;
};

export const createSavingsGoal = async (goalData) => {
  const response = await api.post('/savings-goals', goalData);
  return response.data;
};

export const updateSavingsGoal = async (id, goalData) => {
  const response = await api.put(`/savings-goals/${id}`, goalData);
  return response.data;
};

export const updateSavingsGoalProgress = async (id, amount) => {
  const response = await api.put(`/savings-goals/${id}/progress`, { amount });
  return response.data;
};

export const deleteSavingsGoal = async (id) => {
  const response = await api.delete(`/savings-goals/${id}`);
  return response.data;
};

// ==================== Financial Summary APIs ====================
export const getFinancialSummary = async () => {
  const response = await api.get('/summary');
  return response.data;
};

export const getCategoryBreakdown = async () => {
  const summary = await getFinancialSummary();
  return summary.expensesByCategory;
};

// ==================== Export APIs ====================
export const exportToCSV = async () => {
  const response = await api.get('/export/csv', {
    responseType: 'blob',
  });
  return response.data;
};

export const exportToPDF = async () => {
  const response = await api.get('/export/pdf', {
    responseType: 'blob',
  });
  return response.data;
};

export const exportData = async (format = 'csv') => {
  if (format === 'pdf') {
    return await exportToPDF();
  }
  return await exportToCSV();
};

// ==================== AI Advisor APIs (Mock for now) ====================
export const getAISuggestions = async () => {
  // Mock implementation - can be replaced with actual AI service
  const summary = await getFinancialSummary();
  const suggestions = [];
  
  if (summary.totalExpenses > summary.totalIncome * 0.8) {
    suggestions.push({
      title: 'High Spending Alert',
      message: 'Your expenses are 80% of your income. Consider reducing discretionary spending.',
      priority: 'high'
    });
  }
  
  if (summary.savingsRate < 20) {
    suggestions.push({
      title: 'Increase Savings',
      message: 'Try to save at least 20% of your income for better financial health.',
      priority: 'medium'
    });
  }
  
  return suggestions;
};

export const getSpendingInsights = async () => {
  const summary = await getFinancialSummary();
  return {
    topCategory: Object.keys(summary.expensesByCategory || {}).reduce((a, b) => 
      (summary.expensesByCategory[a] > summary.expensesByCategory[b] ? a : b), ''),
    totalCategories: Object.keys(summary.expensesByCategory || {}).length,
    savingsRate: summary.savingsRate,
  };
};

// ==================== Forum APIs (Optional - Not implemented in backend yet) ====================
export const getForumPosts = async () => {
  // Mock implementation
  return [];
};

export const createForumPost = async (postData) => {
  // Mock implementation
  return { id: Date.now(), ...postData };
};

export const addComment = async (postId, commentData) => {
  // Mock implementation
  return { id: Date.now(), postId, ...commentData };
};

export const likePost = async (postId) => {
  // Mock implementation
  return { postId, liked: true };
};

export default api;
