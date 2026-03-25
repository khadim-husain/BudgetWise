# 🚀 BudgetWise - Quick Start Guide

## ✅ Current Status
- ✅ Backend running on http://localhost:9090
- ✅ Frontend running on http://localhost:3000
- ✅ Database connected (budgetwiseDb)
- ✅ All API endpoints tested and working

---

## 🎯 Try It Now!

### Step 1: Open the Application
Open your browser and go to: **http://localhost:3000**

### Step 2: Register a New Account
1. Click on "Register" or go to http://localhost:3000/register
2. Fill in:
   - Name: "Your Name"
   - Email: "your.email@example.com"
   - Password: "yourpassword" (minimum 6 characters)
3. Click "Register"
4. You'll be automatically logged in!

### Step 3: Add Your First Income
1. Click "Add Income" in the sidebar
2. Fill in the form:
   - **Income Name:** "Monthly Salary" or "Freelance Project"
   - **Amount:** 50000
   - **Category:** Select "Salary" from dropdown
   - **Date:** Select today's date
   - **Description:** Optional notes
3. Click "💰 Add Income"
4. You'll be redirected to the Dashboard

### Step 4: Add Your First Expense
1. Click "Add Expense" in the sidebar
2. Fill in the form:
   - **Expense Name:** "Grocery Shopping" or "Electricity Bill"
   - **Amount:** 2500
   - **Category:** Click on a category icon (e.g., 🍔 Food)
   - **Date:** Select date
   - **Description:** Optional notes
3. Click "💸 Add Expense"
4. See it reflected immediately!

### Step 5: Create a Budget
1. Go to "Budget Manager"
2. In the "Add New Budget" section:
   - **Category:** Select "Groceries" or "Food"
   - **Amount:** 10000
3. Click "➕ Add Budget"
4. Watch as the spent amount auto-calculates from your expenses!

### Step 6: View Your Dashboard
1. Click "Dashboard" in the sidebar
2. See your financial summary:
   - 💰 Total Income
   - 💸 Total Expenses
   - 💵 Current Balance
   - 📊 Savings Rate %
3. View the beautiful charts:
   - Doughnut chart showing expense breakdown
   - Line chart showing income vs expenses trend
4. Check recent transactions

### Step 7: Switch Theme
1. Click the 🌙 / ☀️ icon in the top-right header
2. Toggle between Dark and Light mode
3. Theme preference is saved automatically!

---

## 🎨 Features to Explore

### 1. Dashboard
- Real-time financial overview
- Interactive charts
- Recent transactions
- Quick action buttons

### 2. Transactions
- **Add Income:** Salary, Freelance, Business, Investment, etc.
- **Add Expense:** Food, Transport, Shopping, Bills, etc.
- View all transactions with filters

### 3. Budget Manager
- Create monthly budgets by category
- Track spending against budget
- Visual progress bars
- Color-coded warnings (green < 80%, yellow 80-100%, red > 100%)

### 4. Reports
- View detailed transaction reports
- Filter by date range
- Export to CSV
- Analyze spending patterns

### 5. AI Advisor (Coming Soon)
- Get personalized financial advice
- Spending insights
- Savings recommendations

### 6. Forum (Coming Soon)
- Community discussions
- Financial tips
- Q&A section

---

## 📱 Test Scenarios

### Scenario 1: Monthly Budget Tracking
1. Add monthly income (salary)
2. Create budgets for each expense category
3. Add daily expenses
4. Watch budgets auto-update
5. Get warnings when nearing limits

### Scenario 2: Savings Goal
1. Go to Dashboard
2. Click "Set Savings Goal"
3. Create a goal (e.g., "Emergency Fund - ₹100,000")
4. Track progress as you add income

### Scenario 3: Expense Analysis
1. Add various expenses over several days
2. Go to Dashboard
3. View category breakdown in Doughnut chart
4. Identify top spending categories
5. Adjust budgets accordingly

---

## 🔐 Sample Test Account

You can use the API test script to create a pre-populated account:

```powershell
.\test-api.ps1
```

This will:
- Register a new user
- Add sample income
- Add sample expense
- Create a budget
- Create a savings goal

---

## 🎯 Key Features Demonstrated

✅ **Authentication**
- Secure JWT-based login
- Password encryption (BCrypt)
- Auto-logout on session expire

✅ **Real-time Updates**
- Dashboard refreshes automatically
- Budgets update when expenses added
- Balance calculates instantly

✅ **Data Persistence**
- All data saved to MySQL database
- Transactions stored permanently
- User preferences saved

✅ **Visual Analytics**
- Chart.js powered visualizations
- Category breakdown
- Trend analysis

✅ **User Experience**
- Dark/Light theme toggle
- Smooth animations
- Responsive design
- Success/Error notifications

---

## 🐛 Quick Troubleshooting

### "Cannot connect to backend"
```powershell
# Check if backend is running
netstat -ano | findstr ":9090"

# If not, restart it
cd backend
mvn spring-boot:run
```

### "Not logged in" or 401 Error
1. Go to http://localhost:3000/login
2. Login again
3. Token refreshes automatically

### "No data showing"
1. Make sure you're logged in
2. Add some transactions first
3. Refresh the page (F5)

### Frontend not loading
```powershell
# Check if frontend is running
netstat -ano | findstr ":3000"

# If not, restart it
cd frontend
npm start
```

---

## 📊 Expected Test Results

After adding a few transactions, you should see:

**Dashboard Stats:**
- Income: ₹5,000 - ₹50,000 (depending on what you added)
- Expenses: ₹150 - ₹10,000
- Balance: Income - Expenses
- Savings Rate: (Balance / Income) × 100%

**Charts:**
- Doughnut chart with colored segments for each expense category
- Line chart showing income (green) and expenses (red)

**Recent Transactions:**
- List of 5 most recent transactions
- Shows name, amount, category, and date
- Green for income, red for expenses

---

## ✨ What Makes This Special?

1. **Full Stack Integration:** React frontend seamlessly communicates with Spring Boot backend
2. **Real Database:** MySQL stores all your data persistently
3. **Security:** JWT authentication protects all API endpoints
4. **Modern UI:** Beautiful dark/light theme with smooth transitions
5. **Real-time Charts:** Live data visualization with Chart.js
6. **Auto-calculations:** Budgets and balances update automatically

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ You can register and login
✅ Dashboard shows your financial summary
✅ Adding income/expense reflects immediately
✅ Charts display your data
✅ Budgets show progress bars
✅ Theme toggle works smoothly
✅ Data persists after page refresh
✅ Export downloads CSV file

---

## 📞 Need Help?

Check the `INTEGRATION_STATUS.md` file for:
- Complete feature list
- API endpoint documentation
- Database schema
- Configuration details
- Troubleshooting guide

---

**Happy Budgeting! 💰📊🎯**

---

**Quick Access URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:9090/api
- Dashboard: http://localhost:3000/
- Add Income: http://localhost:3000/add-income
- Add Expense: http://localhost:3000/add-expense
- Budget Manager: http://localhost:3000/budget-manager
