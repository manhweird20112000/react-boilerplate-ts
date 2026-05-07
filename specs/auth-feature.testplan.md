# Authentication Feature Test Plan

## Application Overview

The Antgravity application's authentication module provides user login, registration, and password recovery functionality. The login page is the primary entry point for user authentication, featuring email and password fields with client-side validation, a remember me option, and navigation to related auth flows.

## Test Scenarios

### 1. Login Form Validation

**Seed:** `tests/seed.spec.ts`

#### 1.1. Submit login form with empty fields

**File:** `tests/auth/login-validation.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The login form is displayed with empty email and password fields
  2. Click the login button without entering any credentials
    - expect: The form displays validation error message 'Vui lòng nhập Email.' below the email field
    - expect: The form displays validation error message 'Vui lòng nhập Mật khẩu.' below the password field
    - expect: The form does not submit and user remains on the login page

#### 1.2. Submit login form with invalid email format

**File:** `tests/auth/login-validation.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The login form is displayed
  2. Enter 'invalid-email' in the email field
    - expect: The email field contains the text 'invalid-email'
  3. Enter 'password123' in the password field
    - expect: The password field contains the text (hidden by default)
  4. Click the login button
    - expect: The form displays validation error message 'Định dạng email không hợp lệ.' below the email field
    - expect: The form does not submit

#### 1.3. Submit login form with valid email format but invalid credentials

**File:** `tests/auth/login-validation.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The login form is displayed
  2. Enter 'nonexistent@example.com' in the email field
    - expect: The email field contains the text 'nonexistent@example.com'
  3. Enter 'wrongpassword' in the password field
    - expect: The password field contains the text (hidden by default)
  4. Click the login button
    - expect: The form submits and an error message is displayed (such as 'Invalid email or password')
    - expect: The user remains on the login page

#### 1.4. Submit login form with only email field filled

**File:** `tests/auth/login-validation.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The login form is displayed
  2. Enter 'test@example.com' in the email field
    - expect: The email field contains the text 'test@example.com'
  3. Leave the password field empty and click the login button
    - expect: The form displays validation error message 'Vui lòng nhập Mật khẩu.' below the password field
    - expect: The form does not submit

#### 1.5. Submit login form with only password field filled

**File:** `tests/auth/login-validation.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The login form is displayed
  2. Leave the email field empty
    - expect: The email field is empty
  3. Enter 'password123' in the password field
    - expect: The password field contains the text (hidden by default)
  4. Click the login button
    - expect: The form displays validation error message 'Vui lòng nhập Email.' below the email field
    - expect: The form does not submit

### 2. Password Visibility Toggle

**Seed:** `tests/seed.spec.ts`

#### 2.1. Toggle password visibility from hidden to visible

**File:** `tests/auth/password-visibility.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The login form is displayed
    - expect: The password field shows a hidden state (masked input)
  2. Enter 'mypassword123' in the password field
    - expect: The password field displays dots or asterisks instead of actual characters
  3. Click the eye icon (visibility toggle) next to the password field
    - expect: The eye icon changes to indicate the password is now visible
    - expect: The password field displays the actual text 'mypassword123'

#### 2.2. Toggle password visibility from visible to hidden

**File:** `tests/auth/password-visibility.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The login form is displayed
  2. Click the eye icon to show the password field
    - expect: The password field is now in visible mode
  3. Enter 'mypassword123' and verify it's visible
    - expect: The password field displays 'mypassword123' as plain text
  4. Click the eye icon again to hide the password
    - expect: The eye icon changes to indicate the password is now hidden
    - expect: The password field displays dots or asterisks instead of the actual text

### 3. Remember Me Functionality

**Seed:** `tests/seed.spec.ts`

#### 3.1. Remember me checkbox is checked by default

**File:** `tests/auth/remember-me.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The login form is displayed
    - expect: The 'Ghi nhớ đăng nhập' (Remember me) checkbox is checked by default

#### 3.2. Toggle remember me checkbox

**File:** `tests/auth/remember-me.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The login form is displayed
    - expect: The 'Ghi nhớ đăng nhập' checkbox is checked
  2. Click the remember me checkbox to uncheck it
    - expect: The checkbox becomes unchecked
  3. Click the remember me checkbox again to check it
    - expect: The checkbox becomes checked

### 4. Navigation Flows

**Seed:** `tests/seed.spec.ts`

#### 4.1. Click Forgot Password link navigates to password recovery page

**File:** `tests/auth/navigation.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The login form is displayed
  2. Click the 'Quên mật khẩu?' (Forgot Password) link
    - expect: The user is navigated to the forgot password page (/auth/forgot-password)
    - expect: The page displays 'Quên mật khẩu' heading
    - expect: The page shows an email input field and 'Đặt lại mật khẩu' (Reset Password) button

#### 4.2. Click Sign Up link navigates to registration page

**File:** `tests/auth/navigation.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The login form is displayed
  2. Click the 'Đăng ký ngay' (Sign up) link
    - expect: The user is navigated to the registration page (/auth/register)
    - expect: The page displays 'Tạo tài khoản mới' heading
    - expect: The page shows fields for full name, email, password, and password confirmation

#### 4.3. Back button on forgot password page returns to login

**File:** `tests/auth/navigation.spec.ts`

**Steps:**
  1. Navigate to the login page and click the forgot password link
    - expect: The user is on the forgot password page
  2. Click the 'Quay lại đăng nhập' (Back to Login) link
    - expect: The user is navigated back to the login page (/auth/login)

#### 4.4. Back browser button from forgot password page returns to login

**File:** `tests/auth/navigation.spec.ts`

**Steps:**
  1. Navigate to the login page and click the forgot password link
    - expect: The user is on the forgot password page
  2. Click the browser back button
    - expect: The user is navigated back to the login page

### 5. Email Field Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 5.1. Email field with spaces around valid email

**File:** `tests/auth/email-edge-cases.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The login form is displayed
  2. Enter '  test@example.com  ' in the email field (with leading and trailing spaces)
    - expect: The email field contains the text with spaces
  3. Enter a password and click the login button
    - expect: The form either strips spaces and submits, or shows validation error depending on implementation

#### 5.2. Email field with special characters

**File:** `tests/auth/email-edge-cases.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The login form is displayed
  2. Enter 'test+tag@example.com' in the email field
    - expect: The email field accepts the input
  3. Enter a password and click the login button
    - expect: The form validates the email format as valid and submission is attempted

#### 5.3. Email field with uppercase characters

**File:** `tests/auth/email-edge-cases.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The login form is displayed
  2. Enter 'Test@Example.COM' in the email field
    - expect: The email field accepts the input
  3. Enter a password and click the login button
    - expect: The form validates the email format as valid and submission is attempted

### 6. Password Field Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 6.1. Password field with special characters

**File:** `tests/auth/password-edge-cases.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The login form is displayed
  2. Enter 'Pass!@#$%^&*()' in the password field containing special characters
    - expect: The password field accepts the special characters
  3. Enter a valid email and click the login button
    - expect: The form submits and password is sent to the server (or error if user doesn't exist)

#### 6.2. Password field with spaces

**File:** `tests/auth/password-edge-cases.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The login form is displayed
  2. Enter 'pass word 123' in the password field which includes spaces
    - expect: The password field accepts the text with spaces
  3. Enter a valid email and click the login button
    - expect: The form submits the password with spaces (spaces are part of the password)

#### 6.3. Password field with very long password

**File:** `tests/auth/password-edge-cases.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The login form is displayed
  2. Enter a very long password (100+ characters) in the password field
    - expect: The password field accepts the long input
    - expect: The field does not have a visible length limit on the UI
  3. Enter a valid email and click the login button
    - expect: The form submits the long password

### 7. UI and Accessibility

**Seed:** `tests/seed.spec.ts`

#### 7.1. Login page displays all required elements

**File:** `tests/auth/ui-accessibility.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The page displays the ANTGRAVITY branding and 'Enterprise Precision Console' subtitle
    - expect: The page displays 'Đăng nhập' heading
    - expect: The page displays 'Chào mừng bạn quay trở lại với Antgravity' welcome text
    - expect: The email input field with user icon is visible
    - expect: The password input field with lock icon is visible
    - expect: The password visibility toggle button is visible
    - expect: The remember me checkbox with label is visible
    - expect: The login button is visible and blue
    - expect: The forgot password link is visible
    - expect: The sign up link is visible
    - expect: The footer with copyright text is visible

#### 7.2. Form input fields have proper labels and placeholders

**File:** `tests/auth/ui-accessibility.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The email field displays 'Email' placeholder text
    - expect: The password field displays 'Mật khẩu' placeholder text
    - expect: Both fields have associated icons (user for email, lock for password)

#### 7.3. Login button is properly focused and clickable

**File:** `tests/auth/ui-accessibility.spec.ts`

**Steps:**
  1. Navigate to the login page at http://localhost:9999/auth/login
    - expect: The login button is visible and blue colored
  2. Tab to the login button using keyboard navigation
    - expect: The login button receives focus and shows a focus indicator
  3. Press Enter key while button is focused
    - expect: The login form is submitted (with validation if fields are empty)
