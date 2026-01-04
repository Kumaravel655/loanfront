from base_test import BaseTest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
import pytest
import time

class TestBasicFunctionality(BaseTest):
    
    @pytest.mark.smoke
    def test_app_loads(self):
        """Test if React app loads"""
        self.driver.get(self.base_url)
        time.sleep(3)
        
        # Check if React app loaded (look for React root or any content)
        page_source = self.driver.page_source
        assert len(page_source) > 1000 or "react" in page_source.lower()
    
    @pytest.mark.smoke  
    def test_basic_navigation(self):
        """Test basic navigation works"""
        self.driver.get(self.base_url)
        time.sleep(2)
        
        # Just verify we can navigate and page responds
        current_url = self.driver.current_url
        assert self.base_url in current_url
    
    def test_page_title(self):
        """Test page has a title"""
        self.driver.get(self.base_url)
        time.sleep(2)
        
        title = self.driver.title
        assert title is not None and len(title) > 0