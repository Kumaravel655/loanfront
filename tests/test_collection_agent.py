from base_test import BaseTest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import pytest
import time

class TestCollectionAgent(BaseTest):
    
    def test_agent_dashboard_access(self):
        """Test collection agent dashboard access"""
        # Login as collection agent
        self.login("agent@example.com", "password123")
        
        # Verify agent dashboard elements
        dashboard_title = self.wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Collection Agent')]")))
        assert dashboard_title.is_displayed()
        
        # Verify key dashboard components
        today_summary = self.driver.find_element(By.CSS_SELECTOR, ".today-summary, .summary-card")
        assigned_loans = self.driver.find_element(By.CSS_SELECTOR, ".assigned-loans, .loans-section")
        pending_dues = self.driver.find_element(By.CSS_SELECTOR, ".pending-dues, .dues-section")
        
        assert today_summary.is_displayed()
        assert assigned_loans.is_displayed()
        assert pending_dues.is_displayed()
    
    def test_collect_payment(self):
        """Test payment collection process"""
        self.login("agent@example.com", "password123")
        
        # Navigate to assigned loans
        self.driver.get(f"{self.base_url}/agent/loans")
        
        # Click collect button for first loan
        collect_btn = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Collect')]")))
        collect_btn.click()
        
        # Fill payment collection form
        amount_input = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='amount'], input[placeholder*='amount']")))
        payment_method = self.driver.find_element(By.CSS_SELECTOR, "select[name='payment_method']")
        notes = self.driver.find_element(By.CSS_SELECTOR, "textarea[name='notes']")
        
        amount_input.send_keys("5000")
        Select(payment_method).select_by_value("cash")
        notes.send_keys("Payment collected successfully")
        
        # Submit payment
        submit_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Submit')]")
        submit_btn.click()
        
        # Verify success message
        success_msg = self.wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'collected')]")))
        assert success_msg.is_displayed()
    
    def test_view_collection_history(self):
        """Test viewing collection history"""
        self.login("agent@example.com", "password123")
        
        # Navigate to collection history
        self.driver.get(f"{self.base_url}/agent/history")
        
        # Verify history table is displayed
        history_table = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table, .history-list")))
        assert history_table.is_displayed()
        
        # Verify table has data
        rows = self.driver.find_elements(By.CSS_SELECTOR, "tr, .history-item")
        assert len(rows) > 1  # Header + at least one data row
    
    def test_agent_performance_metrics(self):
        """Test agent performance metrics display"""
        self.login("agent@example.com", "password123")
        
        # Navigate to performance page
        self.driver.get(f"{self.base_url}/agent/performance")
        
        # Verify performance metrics are displayed
        metrics_container = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".performance-metrics, .metrics-container")))
        assert metrics_container.is_displayed()
        
        # Check for key metrics
        collection_rate = self.driver.find_element(By.XPATH, "//*[contains(text(), 'Collection Rate')]")
        target_achievement = self.driver.find_element(By.XPATH, "//*[contains(text(), 'Target')]")
        
        assert collection_rate.is_displayed()
        assert target_achievement.is_displayed()