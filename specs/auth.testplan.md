# Authentication Test Plan

## Application Overview

Test the authentication feature covering the login page UI, form validation, error handling, successful login, and submission state in the React app.

## Test Scenarios

### 1. Authentication

**Seed:** `tests/auth.spec.ts`

#### 1.1. Login page loads with correct UI elements

**File:** `tests/auth.spec.ts`

**Steps:**
  1. Open the application at /login
    - expect: The login page is displayed
    - expect: The title text 'Đăng nhập' is visible
    - expect: The subtitle text 'Chào mừng bạn quay trở lại' is visible
    - expect: Email and password input fields are visible
    - expect: The login button is visible
    - expect: Forgot password and register links are visible

#### 1.2. Show required validation errors when fields are empty

**File:** `tests/auth.spec.ts`

**Steps:**
  1. Leave email and password empty and click the login button
    - expect: Validation message 'Vui lòng nhập Email' is visible
    - expect: Validation message 'Vui lòng nhập Mật khẩu' is visible
    - expect: The page stays on /login

#### 1.3. Show email format validation error

**File:** `tests/auth.spec.ts`

**Steps:**
  1. Enter an invalid email such as 'not-an-email' and a valid password, then click login
    - expect: Validation message 'Định dạng email không hợp lệ.' is visible
    - expect: No submit success toast appears
    - expect: The page stays on /login

#### 1.4. Display error for invalid credentials

**File:** `tests/auth.spec.ts`

**Steps:**
  1. Enter email 'wrong@example.com' and password 'wrongpassword' and submit the form
    - expect: An error toast or message with text 'Invalid email or password' is visible
    - expect: The login page remains displayed
    - expect: No redirect to /dashboard occurs

#### 1.5. Login successfully with correct credentials

**File:** `tests/auth.spec.ts`

**Steps:**
  1. Enter email 'admin@example.com' and password 'password' and submit the form
    - expect: Success toast text 'Đăng nhập thành công' is visible
    - expect: The user is redirected to /dashboard
    - expect: Dashboard placeholder content is visible
    - expect: localStorage contains the key 'auth_token' with a token value

#### 1.6. Show submitting state while login request is in progress

**File:** `tests/auth.spec.ts`

**Steps:**
  1. Submit the login form with valid credentials and observe the button state
    - expect: The login button becomes disabled while the request is in progress
    - expect: The button text changes to 'Đang đăng nhập...' while submitting
    - expect: After the request completes, the button returns to enabled state and text 'Đăng nhập' resumes
