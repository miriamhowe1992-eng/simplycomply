#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class SimplyComplyAPITester:
    def __init__(self, base_url="https://biz-compliance-2.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.business_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log(self, message):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {message}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        self.log(f"🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.log(f"✅ {name} - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                self.log(f"❌ {name} - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    self.log(f"   Error: {error_detail}")
                except:
                    self.log(f"   Response: {response.text[:200]}")
                
                self.failed_tests.append({
                    "test": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "error": response.text[:200]
                })
                return False, {}

        except Exception as e:
            self.log(f"❌ {name} - Exception: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "endpoint": endpoint,
                "expected": expected_status,
                "actual": "Exception",
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_reference_data(self):
        """Test reference data endpoints"""
        tests = [
            ("Get Sectors", "GET", "reference/sectors", 200),
            ("Get Nations", "GET", "reference/nations", 200),
            ("Get Business Sizes", "GET", "reference/business-sizes", 200),
            ("Get Categories", "GET", "reference/categories", 200),
        ]
        
        results = []
        for name, method, endpoint, expected in tests:
            success, data = self.run_test(name, method, endpoint, expected)
            results.append((success, data))
        
        return all(r[0] for r in results), [r[1] for r in results]

    def test_subscription_plans(self):
        """Test subscription plans endpoint"""
        return self.run_test("Get Subscription Plans", "GET", "subscription/plans", 200)

    def test_user_signup(self, email, password, full_name):
        """Test user signup"""
        success, response = self.run_test(
            "User Signup",
            "POST",
            "auth/signup",
            200,
            data={
                "email": email,
                "password": password,
                "full_name": full_name
            }
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            self.log(f"   Token acquired: {self.token[:20]}...")
            return True, response
        return False, response

    def test_user_login(self, email, password):
        """Test user login"""
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data={
                "email": email,
                "password": password
            }
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            self.log(f"   Token acquired: {self.token[:20]}...")
            return True, response
        return False, response

    def test_get_user_profile(self):
        """Test get current user profile"""
        return self.run_test("Get User Profile", "GET", "auth/me", 200)

    def test_create_business(self):
        """Test business creation"""
        business_data = {
            "name": "Test Veterinary Practice",
            "industry": "Healthcare",
            "sector": "veterinary",
            "size": "small",
            "uk_nation": "England",
            "address": "123 Test Street, London",
            "phone": "020 1234 5678"
        }
        
        success, response = self.run_test(
            "Create Business",
            "POST",
            "business",
            200,
            data=business_data
        )
        
        if success and 'id' in response:
            self.business_id = response['id']
            self.log(f"   Business created: {self.business_id}")
            return True, response
        return False, response

    def test_get_business(self):
        """Test get business profile"""
        return self.run_test("Get Business", "GET", "business", 200)

    def test_dashboard_stats(self):
        """Test dashboard statistics"""
        return self.run_test("Dashboard Stats", "GET", "dashboard/stats", 200)

    def test_checklist_operations(self):
        """Test checklist operations"""
        # Get checklist
        success, checklist = self.run_test("Get Checklist", "GET", "checklist", 200)
        
        if not success or not checklist:
            return False, "Failed to get checklist"
        
        # Update first item status if available
        if len(checklist) > 0:
            item_id = checklist[0]['id']
            success, _ = self.run_test(
                "Update Checklist Status",
                "PUT",
                f"checklist/{item_id}/status?status=complete",
                200
            )
            return success, checklist
        
        return True, checklist

    def test_documents_operations(self):
        """Test documents operations"""
        # Get all documents
        success, documents = self.run_test("Get Documents", "GET", "documents", 200)
        
        if not success:
            return False, "Failed to get documents"
        
        # Get specific document if available
        if len(documents) > 0:
            doc_id = documents[0]['id']
            success, doc = self.run_test(
                "Get Specific Document",
                "GET",
                f"documents/{doc_id}",
                200
            )
            return success, documents
        
        return True, documents

    def test_notifications(self):
        """Test notifications operations"""
        # Get notifications
        success, notifications = self.run_test("Get Notifications", "GET", "notifications", 200)
        
        if success:
            # Mark all as read
            success2, _ = self.run_test(
                "Mark All Notifications Read",
                "POST",
                "notifications/mark-all-read",
                200
            )
            return success and success2, notifications
        
        return success, notifications

    def test_employee_operations(self):
        """Test comprehensive employee operations"""
        self.log("\n👥 Testing Employee Management...")
        
        # Test getting employee requirement types first
        success, req_types = self.run_test("Get Employee Requirement Types", "GET", "employees/requirements/types", 200)
        if not success:
            return False, "Failed to get requirement types"
        
        # Test getting employees (should be empty initially)
        success, employees = self.run_test("Get Employees List", "GET", "employees", 200)
        if not success:
            return False, "Failed to get employees list"
        
        # Test compliance overview (should work even with no employees)
        success, overview = self.run_test("Get Compliance Overview", "GET", "employees/compliance/overview", 200)
        if not success:
            return False, "Failed to get compliance overview"
        
        # Create a test employee
        employee_data = {
            "first_name": "John",
            "last_name": "Smith", 
            "email": "john.smith@testvet.com",
            "job_title": "Veterinary Surgeon",
            "department": "Clinical",
            "start_date": "2024-01-15",
            "phone": "07123456789",
            "emergency_contact": "Jane Smith - 07987654321"
        }
        
        success, employee = self.run_test("Create Employee", "POST", "employees", 200, data=employee_data)
        if not success:
            return False, "Failed to create employee"
        
        employee_id = employee.get('id')
        if not employee_id:
            return False, "Employee created but no ID returned"
        
        self.log(f"   Employee created with ID: {employee_id}")
        
        # Test getting specific employee
        success, emp_detail = self.run_test("Get Employee Detail", "GET", f"employees/{employee_id}", 200)
        if not success:
            return False, "Failed to get employee detail"
        
        # Test getting employee requirements (should be auto-generated for veterinary sector)
        success, requirements = self.run_test("Get Employee Requirements", "GET", f"employees/{employee_id}/requirements", 200)
        if not success:
            return False, "Failed to get employee requirements"
        
        self.log(f"   Employee has {len(requirements)} auto-generated requirements")
        
        # Test updating an employee requirement if any exist
        if requirements:
            req_id = requirements[0]['id']
            update_data = {
                "issue_date": "2024-01-20",
                "expiry_date": "2027-01-20", 
                "reference_number": "DBS-123456789"
            }
            
            success, updated_req = self.run_test(
                "Update Employee Requirement", 
                "PUT", 
                f"employees/{employee_id}/requirements/{req_id}", 
                200, 
                data=update_data
            )
            if not success:
                return False, "Failed to update employee requirement"
        
        # Test adding a custom requirement
        custom_req_data = {
            "requirement_type": "other",
            "title": "Custom Training Certificate",
            "description": "Special veterinary training",
            "issue_date": "2024-02-01",
            "expiry_date": "2025-02-01",
            "reference_number": "TRAIN-001"
        }
        
        success, new_req = self.run_test(
            "Add Custom Requirement",
            "POST", 
            f"employees/{employee_id}/requirements",
            200,
            data=custom_req_data
        )
        if not success:
            return False, "Failed to add custom requirement"
        
        # Test updating employee details
        update_emp_data = {
            "phone": "07111222333",
            "department": "Surgery"
        }
        
        success, updated_emp = self.run_test(
            "Update Employee",
            "PUT",
            f"employees/{employee_id}",
            200,
            data=update_emp_data
        )
        if not success:
            return False, "Failed to update employee"
        
        # Test getting updated compliance overview
        success, updated_overview = self.run_test("Get Updated Compliance Overview", "GET", "employees/compliance/overview", 200)
        if not success:
            return False, "Failed to get updated compliance overview"
        
        # Test getting updated employees list
        success, updated_employees = self.run_test("Get Updated Employees List", "GET", "employees", 200)
        if not success:
            return False, "Failed to get updated employees list"
        
        # Test deleting employee (cleanup)
        success, _ = self.run_test("Delete Employee", "DELETE", f"employees/{employee_id}", 200)
        if not success:
            self.log("   Warning: Failed to delete test employee (cleanup)")
        
        return True, "All employee operations completed successfully"

    def run_comprehensive_test(self):
        """Run all tests in sequence"""
        self.log("🚀 Starting SimplyComply API Tests")
        self.log(f"   Base URL: {self.base_url}")
        
        # Test basic endpoints (no auth required)
        self.log("\n📋 Testing Public Endpoints...")
        self.test_root_endpoint()
        self.test_reference_data()
        self.test_subscription_plans()
        
        # Test authentication
        self.log("\n🔐 Testing Authentication...")
        test_email = f"test_{datetime.now().strftime('%H%M%S')}@example.com"
        test_password = "TestPass123!"
        test_name = "Test User"
        
        # Signup new user
        signup_success, _ = self.test_user_signup(test_email, test_password, test_name)
        
        if not signup_success:
            # Try login with existing test credentials
            self.log("   Signup failed, trying existing credentials...")
            login_success, _ = self.test_user_login("test@example.com", "TestPass123")
            if not login_success:
                self.log("❌ Authentication failed completely")
                return self.print_results()
        
        # Test authenticated endpoints
        self.log("\n👤 Testing User Operations...")
        self.test_get_user_profile()
        
        self.log("\n🏢 Testing Business Operations...")
        self.test_create_business()
        self.test_get_business()
        
        self.log("\n📊 Testing Dashboard & Data...")
        self.test_dashboard_stats()
        self.test_checklist_operations()
        self.test_documents_operations()
        self.test_notifications()
        
        # Test employee operations
        self.test_employee_operations()
        
        return self.print_results()

    def print_results(self):
        """Print test results summary"""
        self.log(f"\n📊 Test Results Summary:")
        self.log(f"   Tests Run: {self.tests_run}")
        self.log(f"   Tests Passed: {self.tests_passed}")
        self.log(f"   Tests Failed: {len(self.failed_tests)}")
        self.log(f"   Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            self.log(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                self.log(f"   • {test['test']}: {test['endpoint']} (Expected {test['expected']}, got {test['actual']})")
        
        return 0 if len(self.failed_tests) == 0 else 1

def main():
    tester = SimplyComplyAPITester()
    return tester.run_comprehensive_test()

if __name__ == "__main__":
    sys.exit(main())