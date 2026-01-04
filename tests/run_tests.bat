@echo off
echo Starting Selenium Test Automation...

REM Create reports directory
if not exist reports mkdir reports

REM Install dependencies
echo Installing test dependencies...
pip install -r requirements.txt

REM Run all tests
echo Running all tests...
pytest --html=reports/full_report.html --self-contained-html

REM Run smoke tests only
echo Running smoke tests...
pytest -m smoke --html=reports/smoke_report.html --self-contained-html

REM Run specific test categories
echo Running authentication tests...
pytest test_authentication.py --html=reports/auth_report.html --self-contained-html

echo Running customer management tests...
pytest test_customer_management.py --html=reports/customer_report.html --self-contained-html

echo Running loan management tests...
pytest test_loan_management.py --html=reports/loan_report.html --self-contained-html

echo Running collection agent tests...
pytest test_collection_agent.py --html=reports/collection_report.html --self-contained-html

echo Running admin dashboard tests...
pytest test_admin_dashboard.py --html=reports/admin_report.html --self-contained-html

echo Test execution completed. Check reports/ directory for results.
pause