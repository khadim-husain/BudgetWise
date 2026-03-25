# Test Backend API
Write-Host "Testing BudgetWise Backend API..." -ForegroundColor Cyan

# Test 1: Register User
Write-Host ""
Write-Host "1. Testing Registration..." -ForegroundColor Yellow
$randomNum = Get-Random -Minimum 1000 -Maximum 9999
$registerBody = @{
    name = "Test User"
    email = "testuser$randomNum@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:9090/api/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "Registration successful!" -ForegroundColor Green
    Write-Host "User: $($registerResponse.email)" -ForegroundColor Gray
    $token = $registerResponse.token
    $email = $registerResponse.email
} catch {
    Write-Host "Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Login
Write-Host ""
Write-Host "2. Testing Login..." -ForegroundColor Yellow
$loginBody = @{
    email = $email
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:9090/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "Login successful!" -ForegroundColor Green
    $token = $loginResponse.token
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Add Transaction (Income)
Write-Host ""
Write-Host "3. Testing Add Income..." -ForegroundColor Yellow
$incomeBody = @{
    name = "Monthly Salary"
    amount = 5000
    category = "Salary"
    description = "Monthly salary"
    date = "2026-03-01"
    type = "INCOME"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $incomeResponse = Invoke-RestMethod -Uri "http://localhost:9090/api/transactions" -Method POST -Body $incomeBody -Headers $headers
    Write-Host "Income added successfully! ID: $($incomeResponse.id)" -ForegroundColor Green
} catch {
    Write-Host "Add income failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Add Transaction (Expense)
Write-Host ""
Write-Host "4. Testing Add Expense..." -ForegroundColor Yellow
$expenseBody = @{
    name = "Weekly Groceries"
    amount = 150
    category = "Groceries"
    description = "Weekly groceries"
    date = "2026-03-05"
    type = "EXPENSE"
} | ConvertTo-Json

try {
    $expenseResponse = Invoke-RestMethod -Uri "http://localhost:9090/api/transactions" -Method POST -Body $expenseBody -Headers $headers
    Write-Host "Expense added successfully! ID: $($expenseResponse.id)" -ForegroundColor Green
} catch {
    Write-Host "Add expense failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get Financial Summary
Write-Host ""
Write-Host "5. Testing Financial Summary..." -ForegroundColor Yellow
try {
    $summaryResponse = Invoke-RestMethod -Uri "http://localhost:9090/api/summary" -Method GET -Headers $headers
    Write-Host "Summary retrieved successfully!" -ForegroundColor Green
    Write-Host "Total Income: $($summaryResponse.totalIncome)" -ForegroundColor Gray
    Write-Host "Total Expenses: $($summaryResponse.totalExpenses)" -ForegroundColor Gray
    Write-Host "Balance: $($summaryResponse.balance)" -ForegroundColor Gray
    Write-Host "Savings Rate: $($summaryResponse.savingsRate)%" -ForegroundColor Gray
} catch {
    Write-Host "Get summary failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Create Budget
Write-Host ""
Write-Host "6. Testing Create Budget..." -ForegroundColor Yellow
$budgetBody = @{
    category = "Groceries"
    amount = 500
    month = 3
    year = 2026
    period = "MONTHLY"
} | ConvertTo-Json

try {
    $budgetResponse = Invoke-RestMethod -Uri "http://localhost:9090/api/budgets" -Method POST -Body $budgetBody -Headers $headers
    Write-Host "Budget created successfully! ID: $($budgetResponse.id)" -ForegroundColor Green
} catch {
    Write-Host "Create budget failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Create Savings Goal
Write-Host ""
Write-Host "7. Testing Create Savings Goal..." -ForegroundColor Yellow
$goalBody = @{
    name = "Emergency Fund"
    targetAmount = 10000
    currentAmount = 0
    targetDate = "2026-12-31"
    description = "Build emergency fund"
} | ConvertTo-Json

try {
    $goalResponse = Invoke-RestMethod -Uri "http://localhost:9090/api/savings-goals" -Method POST -Body $goalBody -Headers $headers
    Write-Host "Savings goal created successfully! ID: $($goalResponse.id)" -ForegroundColor Green
} catch {
    Write-Host "Create savings goal failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "All API tests completed!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
