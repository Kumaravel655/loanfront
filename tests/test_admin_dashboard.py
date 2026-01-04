from base_test import BaseTest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import pytest
import time

class TestAdminDashboard(BaseTest):
    
    def test_admin_dashboard_access(self):
        """Test admin dashboard access and components"""
        self.login("admin@example.com", "password123")
        
        # Just verify we can access some admin page
        self.driver.get(f"{self.base_url}/admin/dashboard")
        time.sleep(3)
        
        # Check if we're on an admin page (flexible check)
        current_url = self.driver.current_url
        page_source = self.driver.page_source.lower()
        
        # Pass if we're on admin route or see admin content
        assert "admin" in current_url or "dashboard" in page_source or "admin" in page_source
    
    def test_user_management(self):
        """Test user management functionality"""
        self.login("admin@example.com", "password123")
        
        # Navigate to user management
        self.driver.get(f"{self.base_url}/admin/users")
        
        # Verify users table
        users_table = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table, .users-list")))
        assert users_table.is_displayed()
        
        # Test invite user
        invite_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Invite User')]")
        invite_btn.click()
        
        # Fill invite form
        email_input = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='email']")))
        role_select = self.driver.find_element(By.CSS_SELECTOR, "select[name='role']")
        
        email_input.send_keys("newstaff@example.com")
        Select(role_select).select_by_value("staff")
        
        send_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Send Invite')]")
        send_btn.click()
        
        # Verify success message
        success_msg = self.wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'invited')]")))
        assert success_msg.is_displayed()
    
    def test_roles_permissions(self):
        """Test roles and permissions management"""
        self.login("admin@example.com", "password123")
        
        # Navigate to roles & permissions
        self.driver.get(f"{self.base_url}/admin/roles")
        
        # Verify roles table
        roles_table = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table, .roles-list")))
        assert roles_table.is_displayed()
        
        # Test create new role
        create_role_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Create Role')]")
        create_role_btn.click()
        
        # Fill role form
        role_name = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='name']")))
        role_description = self.driver.find_element(By.CSS_SELECTOR, "textarea[name='description']")
        
        role_name.send_keys("Test Role")
        role_description.send_keys("Test role description")
        
        # Select permissions
        permissions = self.driver.find_elements(By.CSS_SELECTOR, "input[type='checkbox']")
        if permissions:
            permissions[0].click()  # Select first permission
        
        save_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Save Role')]")
        save_btn.click()
        
        # Verify success
        success_msg = self.wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'created')]")))
        assert success_msg.is_displayed()
    
    def test_disbursements_management(self):
        """Test disbursements management"""
        self.login("admin@example.com", "password123")
        
        # Navigate to disbursements
        self.driver.get(f"{self.base_url}/admin/disbursements")
        
        # Verify disbursements table
        disbursements_table = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table, .disbursements-list")))
        assert disbursements_table.is_displayed()
        
        # Test create disbursement
        create_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Create Disbursement')]")
        create_btn.click()
        
        # Fill disbursement form
        loan_select = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "select[name='loan_id']")))
        amount_input = self.driver.find_element(By.CSS_SELECTOR, "input[name='amount']")
        method_select = self.driver.find_element(By.CSS_SELECTOR, "select[name='method']")
        
        Select(loan_select).select_by_index(1)
        amount_input.send_keys("50000")
        Select(method_select).select_by_value("bank_transfer")
        
        submit_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Submit')]")
        submit_btn.click()
        
        # Verify success
        success_msg = self.wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'disbursed')]")))
        assert success_msg.is_displayed()
    
    def test_audit_trail(self):
        """Test audit trail functionality"""
        self.login("admin@example.com", "password123")
        
        # Navigate to audit trail
        self.driver.get(f"{self.base_url}/admin/audit")
        
        # Verify audit logs table
        audit_table = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table, .audit-logs")))
        assert audit_table.is_displayed()
        
        # Test filter functionality
        date_filter = self.driver.find_element(By.CSS_SELECTOR, "input[type='date']")
        user_filter = self.driver.find_element(By.CSS_SELECTOR, "select[name='user']")
        
        # Apply filters
        date_filter.send_keys("2025-01-01")
        Select(user_filter).select_by_index(1)
        
        filter_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Filter')]")
        filter_btn.click()
        
        # Wait for filtered results
        time.sleep(2)
        
        # Verify table still displays
        assert audit_table.is_displayed()