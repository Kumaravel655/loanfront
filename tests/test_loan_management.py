from base_test import BaseTest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import pytest
import time

class TestLoanManagement(BaseTest):
    
    def test_create_loan_application(self):
        """Test creating a new loan application"""
        self.login()
        
        # Navigate to loan applications
        self.driver.get(f"{self.base_url}/admin/loan-applications")
        
        # Click New Application button
        new_loan_btn = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'New Application')]")))
        new_loan_btn.click()
        
        # Step 1: Select Customer
        customer_select = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "select")))
        select = Select(customer_select)
        select.select_by_index(1)  # Select first customer
        
        next_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Next')]")
        next_btn.click()
        
        # Step 2: Loan Details
        loan_amount = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder*='Loan Amount']")))
        loan_type = self.driver.find_element(By.CSS_SELECTOR, "select")
        total_due = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder*='Total Due']")
        interest = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder*='Interest']")
        repayment_mode = self.driver.find_element(By.CSS_SELECTOR, "select")
        
        loan_amount.send_keys("50000")
        Select(loan_type).select_by_index(1)
        total_due.send_keys("12")
        interest.send_keys("12")
        Select(repayment_mode).select_by_value("monthly")
        
        next_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Next')]")
        next_btn.click()
        
        # Step 3: Review & Submit
        created_by = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder*='Created By']")))
        created_by.send_keys("1")
        
        submit_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Submit')]")
        submit_btn.click()
        
        # Verify success message
        success_msg = self.wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'successfully')]")))
        assert success_msg.is_displayed()
    
    def test_view_loan_details(self):
        """Test viewing loan details"""
        self.login()
        
        # Navigate to loans page
        self.driver.get(f"{self.base_url}/admin/loans")
        
        # Click on first loan to view details
        loan_row = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "tr:nth-child(2), .loan-item:first-child")))
        loan_row.click()
        
        # Verify loan details are displayed
        loan_details = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".loan-details, .loan-info")))
        assert loan_details.is_displayed()
    
    def test_approve_loan(self):
        """Test loan approval process"""
        self.login()
        
        # Navigate to pending loans
        self.driver.get(f"{self.base_url}/admin/loans")
        
        # Find approve button for first loan
        approve_btn = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Approve')]")))
        approve_btn.click()
        
        # Confirm approval in modal
        confirm_btn = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Confirm')]")))
        confirm_btn.click()
        
        # Verify success message
        success_msg = self.wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'approved')]")))
        assert success_msg.is_displayed()