import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import time

class BaseTest:
    @pytest.fixture(autouse=True)
    def setup(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Remove for visual testing
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-background-networking")
        chrome_options.add_argument("--disable-sync")
        chrome_options.add_argument("--disable-translate")
        chrome_options.add_argument("--disable-extensions")
        chrome_options.add_argument("--disable-features=TranslateUI")
        chrome_options.add_argument("--disable-ipc-flooding-protection")
        
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)
        self.base_url = "http://localhost:5173"
        
        yield
        
        self.driver.quit()
    
    def login(self, email="admin@example.com", password="password123"):
        """Helper method to login - flexible implementation"""
        self.driver.get(f"{self.base_url}/login")
        time.sleep(2)
        
        try:
            # Try multiple selectors for email input
            email_input = None
            for selector in ["input[type='email']", "input[name='email']", "#email", ".email-input"]:
                try:
                    email_input = self.driver.find_element(By.CSS_SELECTOR, selector)
                    break
                except:
                    continue
            
            if not email_input:
                print("No email input found - login page may not exist")
                return False
                
            # Try multiple selectors for password input  
            password_input = None
            for selector in ["input[type='password']", "input[name='password']", "#password", ".password-input"]:
                try:
                    password_input = self.driver.find_element(By.CSS_SELECTOR, selector)
                    break
                except:
                    continue
                    
            if not password_input:
                print("No password input found")
                return False
            
            # Try multiple selectors for submit button
            login_btn = None
            for selector in ["button[type='submit']", "input[type='submit']", ".login-btn", "#login-btn"]:
                try:
                    login_btn = self.driver.find_element(By.CSS_SELECTOR, selector)
                    break
                except:
                    continue
                    
            if not login_btn:
                print("No login button found")
                return False
            
            email_input.clear()
            email_input.send_keys(email)
            password_input.clear()
            password_input.send_keys(password)
            login_btn.click()
            
            time.sleep(3)
            return True
                
        except Exception as e:
            print(f"Login failed: {e}")
            return False
    
    def logout(self):
        """Helper method to logout"""
        logout_btn = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Logout')]")))
        logout_btn.click()
        self.wait.until(EC.url_contains("login"))