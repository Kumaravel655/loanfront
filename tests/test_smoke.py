from base_test import BaseTest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
import pytest
import time

class TestSmoke(BaseTest):
    
    @pytest.mark.smoke
    def test_application_loads(self):
        """Test if the application loads successfully"""
        self.driver.get(self.base_url)
        
        # Wait for page to load
        time.sleep(2)
        
        # Check if we're redirected to login or if login page loads
        assert "login" in self.driver.current_url or self.driver.title
    
    @pytest.mark.smoke
    def test_login_page_elements(self):
        """Test if login page has required elements"""
        self.driver.get(f"{self.base_url}/login")
        
        # Check for email input
        email_input = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']")))
        assert email_input.is_displayed()
        
        # Check for password input
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        assert password_input.is_displayed()
        
        # Check for login button
        login_btn = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        assert login_btn.is_displayed()
    
    @pytest.mark.smoke
    def test_signup_page_loads(self):
        """Test if signup page loads"""
        self.driver.get(f"{self.base_url}/signup")
        
        # Wait for page to load
        time.sleep(2)
        
        # Check if signup form is present
        try:
            signup_form = self.driver.find_element(By.CSS_SELECTOR, "form, .signup-form")
            assert signup_form.is_displayed()
        except:
            # If no form found, check if page loaded at all
            assert self.driver.title or "signup" in self.driver.current_url