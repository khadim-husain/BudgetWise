# Finance Tracker Frontend

A comprehensive personal finance management application built with React.

## 🚀 Features

### Dashboard
- **Financial Overview**: View total income, expenses, and remaining balance at a glance
- **Visual Analytics**: Pie charts for expense categories and bar charts for income vs expenses
- **Recent Transactions**: Quick view of latest financial activities
- **Quick Actions**: Fast access to add income, expenses, manage budgets, and get AI tips

### Transaction Management
- **Add Income**: Record income from various sources (Salary, Freelance, Business, etc.)
- **Add Expense**: Track expenses across multiple categories with intuitive category selection
- **Transaction History**: Complete list with filtering, search, and sorting capabilities
- **Edit/Delete**: Manage your transactions easily

### Budget Management
- **Category Budgets**: Set monthly budgets for different spending categories
- **Progress Tracking**: Visual progress bars showing budget utilization
- **Alerts**: Color-coded warnings when approaching or exceeding budget limits
- **Budget Tips**: Helpful suggestions for effective budget management

### Reports & Analytics
- **Detailed Reports**: Comprehensive transaction reports with filters
- **Charts & Graphs**: Monthly income vs expenses and savings trends
- **Export Options**: Download reports in PDF or CSV format
- **Advanced Filters**: Filter by type, category, date range, and search terms

### AI Financial Advisor
- **Spending Insights**: AI-powered analysis of spending patterns
- **Personalized Recommendations**: Custom suggestions based on your financial behavior
- **Risk Assessment**: Evaluate your financial risk level
- **Financial Tips**: General money management advice and best practices

### Community Forum
- **Discussion Posts**: Share tips and ask questions
- **Comments System**: Engage with other users
- **Like System**: Show appreciation for helpful posts
- **Categories**: Organized topics for easy navigation

### Authentication
- **User Registration**: Create new accounts securely
- **Login System**: Secure authentication with JWT tokens
- **Session Management**: Persistent login across browser sessions

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── Layout/
│   │   └── Sidebar/
│   ├── pages/
│   │   ├── AddExpense/
│   │   ├── AddIncome/
│   │   ├── AIAdvisor/
│   │   ├── Auth/
│   │   ├── BudgetManager/
│   │   ├── Dashboard/
│   │   ├── Forum/
│   │   └── Reports/
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── App.css
│   │   └── index.css
│   ├── utils/
│   │   ├── exportUtils.js
│   │   └── helpers.js
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```
   The application will open at [http://localhost:3000](http://localhost:3000)

4. **Build for Production**
   ```bash
   npm run build
   ```

## 🎨 Key Technologies

- **React 18**: Modern React with hooks
- **React Router v6**: Client-side routing
- **Chart.js**: Data visualization
- **Axios**: HTTP client for API calls
- **jsPDF**: PDF generation
- **CSS3**: Custom styling with CSS variables

## 🎯 Usage Guide

### First Time Setup
1. Register a new account or use demo credentials
2. Login to access the dashboard
3. Add your first income entry
4. Set up monthly budgets for different categories
5. Start tracking expenses

### Daily Usage
1. **Add Transactions**: Click "Add Income" or "Add Expense" from sidebar
2. **Check Dashboard**: View your financial summary at a glance
3. **Review Budgets**: Monitor spending against budgets
4. **Get AI Tips**: Check AI Advisor for personalized suggestions
5. **Export Reports**: Download monthly reports for record-keeping

## 🎨 Design Features

### Color Scheme
- **Primary**: Indigo (#4f46e5) - Actions & highlights
- **Success/Income**: Green (#10b981) - Income & positive actions
- **Warning/Expense**: Orange (#f59e0b) - Expenses & warnings
- **Danger**: Red (#ef4444) - Overspending & critical alerts
- **Info**: Blue (#3b82f6) - Information & tips

### Responsive Design
- **Desktop**: Full sidebar with detailed views
- **Tablet**: Collapsible sidebar
- **Mobile**: Hidden sidebar with hamburger menu, stacked layouts

### User Experience
- **Smooth Animations**: Fade-in, slide-in effects
- **Hover States**: Interactive feedback on all clickable elements
- **Loading States**: Visual feedback during async operations
- **Error Handling**: User-friendly error messages

## 📊 Data Visualization

### Charts Included
1. **Pie Chart**: Expense breakdown by category
2. **Bar Chart**: Income vs Expenses comparison
3. **Line Chart**: Savings trend over time
4. **Progress Bars**: Budget utilization

## 🔒 Security Features

- JWT token-based authentication
- Secure password handling
- Protected routes
- Auto-logout on token expiration
- Input validation and sanitization

## 🚀 Future Enhancements

- Multi-currency support
- Recurring transactions
- Bill reminders
- Tax calculation
- Investment tracking
- Mobile app (React Native)
- Dark mode
- Offline support with PWA

## 📝 API Integration

The frontend is designed to work with a RESTful API. Update the `REACT_APP_API_URL` environment variable to point to your backend server.

### API Endpoints Expected
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/transactions`
- `POST /api/transactions/income`
- `POST /api/transactions/expense`
- `GET /api/budgets`
- `POST /api/budgets`
- `GET /api/summary`
- `GET /api/ai/suggestions`
- `GET /api/forum/posts`

## 🐛 Troubleshooting

### Common Issues

1. **Dependencies not installing**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Port 3000 already in use**
   ```bash
   # Set a different port
   PORT=3001 npm start
   ```

3. **Charts not rendering**
   - Ensure Chart.js and react-chartjs-2 are properly installed
   - Check browser console for errors

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using React**
