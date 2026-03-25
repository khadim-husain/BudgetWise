import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Export transactions to PDF
export const exportToPDF = (transactions) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text('Financial Report', 14, 20);

  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Add summary
  doc.setFontSize(12);
  doc.text('Summary:', 14, 38);
  doc.setFontSize(10);
  doc.text(`Total Income: ₹${totalIncome.toLocaleString()}`, 14, 45);
  doc.text(`Total Expenses: ₹${totalExpense.toLocaleString()}`, 14, 52);
  doc.text(`Net Balance: ₹${balance.toLocaleString()}`, 14, 59);

  // Prepare table data
  const tableData = transactions.map(t => [
    t.date,
    t.name,
    t.category,
    t.type,
    `₹${t.amount.toLocaleString()}`,
  ]);

  // Add table
  doc.autoTable({
    startY: 68,
    head: [['Date', 'Name', 'Category', 'Type', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { top: 10 },
  });

  // Save PDF
  doc.save(`financial-report-${new Date().toISOString().split('T')[0]}.pdf`);
};

// Export transactions to CSV
export const exportToCSV = (transactions) => {
  // CSV headers
  const headers = ['Date', 'Name', 'Category', 'Type', 'Amount'];
  
  // CSV rows
  const rows = transactions.map(t => [
    t.date,
    t.name,
    t.category,
    t.type,
    t.amount,
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `financial-report-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Format currency
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format date
export const formatDate = (date, format = 'short') => {
  const options = format === 'short' 
    ? { year: 'numeric', month: 'short', day: 'numeric' }
    : { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  
  return new Date(date).toLocaleDateString('en-IN', options);
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(2);
};

// Group transactions by period
export const groupTransactionsByPeriod = (transactions, period = 'month') => {
  const grouped = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    let key;
    
    switch (period) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'year':
        key = date.getFullYear().toString();
        break;
      default:
        key = date.toISOString().split('T')[0];
    }
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    
    grouped[key].push(transaction);
  });
  
  return grouped;
};

// Get category color
export const getCategoryColor = (category) => {
  const colors = {
    Food: '#ef4444',
    Transport: '#f59e0b',
    Shopping: '#10b981',
    Bills: '#3b82f6',
    Entertainment: '#8b5cf6',
    Healthcare: '#ec4899',
    Education: '#14b8a6',
    Travel: '#f97316',
    Salary: '#22c55e',
    Freelance: '#06b6d4',
    Business: '#6366f1',
    Investment: '#8b5cf6',
    Others: '#64748b',
  };
  
  return colors[category] || '#64748b';
};

// Validate transaction data
export const validateTransaction = (data) => {
  const errors = {};
  
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  if (!data.amount || parseFloat(data.amount) <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }
  
  if (!data.category) {
    errors.category = 'Category is required';
  }
  
  if (!data.date) {
    errors.date = 'Date is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const exportUtils = {
  exportToPDF,
  exportToCSV,
  formatCurrency,
  formatDate,
  calculatePercentage,
  groupTransactionsByPeriod,
  getCategoryColor,
  validateTransaction,
};

export default exportUtils;
