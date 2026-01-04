#!/bin/bash

# Selenium Test Execution Script for Loan Management Application

echo "Starting Selenium Test Automation..."

# Create reports directory
mkdir -p reports

# Install dependencies
echo "Installing test dependencies..."
pip install -r requirements.txt

# Download ChromeDriver
echo "Setting up ChromeDriver..."
python -c "from webdriver_manager.chrome import ChromeDriverManager; ChromeDriverManager().install()"

# Run all tests
echo "Running all tests..."
pytest --html=reports/full_report.html --self-contained-html

# Run smoke tests only
echo "Running smoke tests..."
pytest -m smoke --html=reports/smoke_report.html --self-contained-html

# Run specific test categories
echo "Running authentication tests..."
pytest test_authentication.py --html=reports/auth_report.html --self-contained-html

echo "Running customer management tests..."
pytest test_customer_management.py --html=reports/customer_report.html --self-contained-html

echo "Running loan management tests..."
pytest test_loan_management.py --html=reports/loan_report.html --self-contained-html

echo "Running collection agent tests..."
pytest test_collection_agent.py --html=reports/collection_report.html --self-contained-html

echo "Running admin dashboard tests..."
pytest test_admin_dashboard.py --html=reports/admin_report.html --self-contained-html

echo "Test execution completed. Check reports/ directory for results."