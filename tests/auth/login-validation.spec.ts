// spec: specs/auth-feature.testplan.md
// seed: tests/seed.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Login Form Validation', () => {
  test('Submit login form with empty fields', async ({ page }) => {
    // 1. Navigate to the login page at http://localhost:9999/auth/login
    await page.goto('http://localhost:9999/auth/login');
    
    // 2. Click the login button without entering any credentials
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    
    // Verify validation error messages are displayed
    await expect(page.locator('body')).toContainText('Vui lòng nhập Email.');
    await expect(page.locator('body')).toContainText('Vui lòng nhập Mật khẩu.');
    
    // Verify user remains on login page
    await expect(page).toHaveURL('http://localhost:9999/auth/login');
  });

  test('Submit login form with invalid email format', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('http://localhost:9999/auth/login');
    
    // 2. Enter 'invalid-email' in email field
    await page.getByRole('textbox', { name: 'Email' }).fill('invalid-email');
    
    // 3. Enter 'password123' in password field
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('password123');
    
    // 4. Click login button
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    
    // Verify email format validation error is displayed
    await expect(page.locator('body')).toContainText('Định dạng email không hợp lệ.');
    await expect(page).toHaveURL('http://localhost:9999/auth/login');
  });

  test('Submit login form with only email field filled', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('http://localhost:9999/auth/login');
    
    // 2. Enter 'test@example.com' in email field
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    
    // 3. Leave password field empty and click login
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    
    // Verify password validation error is displayed
    await expect(page.locator('body')).toContainText('Vui lòng nhập Mật khẩu.');
    
    // Verify form does not submit
    await expect(page).toHaveURL('http://localhost:9999/auth/login');
  });

  test('Submit login form with only password field filled', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('http://localhost:9999/auth/login');
    
    // 2. Leave email field empty
    // 3. Enter 'password123' in password field
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('password123');
    
    // 4. Click login button
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    
    // Verify email validation error is displayed
    await expect(page.locator('body')).toContainText('Vui lòng nhập Email.');
    
    // Verify form does not submit
    await expect(page).toHaveURL('http://localhost:9999/auth/login');
  });

  test('Submit login form with invalid credentials', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('http://localhost:9999/auth/login');
    
    // 2. Enter 'nonexistent@example.com' in email field
    await page.getByRole('textbox', { name: 'Email' }).fill('nonexistent@example.com');
    
    // 3. Enter 'wrongpassword' in password field
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('wrongpassword');
    
    // 4. Click login button
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    
    // Wait for potential error response
    await page.waitForTimeout(1000);
    
    // Verify user remains on login page (form submission fails)
    await expect(page).toHaveURL('http://localhost:9999/auth/login');
  });
});
