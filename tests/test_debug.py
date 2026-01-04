from base_test import BaseTest
from selenium.webdriver.common.by import By
import time

class TestDebug(BaseTest):
    
    def test_debug_login_page(self):
        """Debug what's actually on login page"""
        self.driver.get(f"{self.base_url}/login")
        time.sleep(3)
        
        print(f"Current URL: {self.driver.current_url}")
        print(f"Page Title: {self.driver.title}")
        print(f"Page Source Length: {len(self.driver.page_source)}")
        
        # Check if page loaded
        if "login" in self.driver.page_source.lower():
            print("✓ Login page loaded")
        else:
            print("✗ Login page not found")
            
        # Save screenshot
        self.driver.save_screenshot("debug_login.png")
    
    def test_debug_after_login(self):
        """Debug what happens after login attempt"""
        self.driver.get(f"{self.base_url}/login")
        time.sleep(2)
        
        try:
            # Try to login
            email_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='email']")
            password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
            login_btn = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            
            email_input.send_keys("admin@example.com")
            password_input.send_keys("password123")
            login_btn.click()
            
            time.sleep(5)
            
            print(f"After login URL: {self.driver.current_url}")
            print(f"After login Title: {self.driver.title}")
            
            # Check for error messages
            if "error" in self.driver.page_source.lower():
                print("✗ Login error detected")
            
            # Save screenshot
            self.driver.save_screenshot("debug_after_login.png")
            
        except Exception as e:
            print(f"Login attempt failed: {e}")
    
    def test_check_app_running(self):
        """Check if app is running at all"""
        try:
            self.driver.get(self.base_url)
            time.sleep(3)
            
            print(f"App URL: {self.base_url}")
            print(f"Response URL: {self.driver.current_url}")
            print(f"Page loaded: {len(self.driver.page_source) > 100}")
            
            if "Cannot GET" in self.driver.page_source:
                print("✗ App not running - start with 'npm run dev'")
            else:
                print("✓ App is running")
                
        except Exception as e:
            print(f"App check failed: {e}")