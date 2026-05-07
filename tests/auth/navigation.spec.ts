// spec: specs/auth-feature.testplan.md
// seed: tests/seed.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Navigation Flows', () => {
  test('Click Forgot Password link navigates to password recovery page', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('http://localhost:9999/auth/login');
    
    // 2. Click the 'Quên mật khẩu?' (Forgot Password) link
    await page.getByRole('link', { name: 'Quên mật khẩu?' }).click();
    
    // Verify navigation to forgot password page
    await expect(page).toHaveURL('http://localhost:9999/auth/forgot-password');
    
    // Verify the page displays 'Quên mật khẩu' heading
    await expect(page.getByRole('heading', { name: 'Quên mật khẩu' })).toBeVisible();
    
    // Verify the page shows an email input field and 'Đặt lại mật khẩu' button
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Đặt lại mật khẩu' })).toBeVisible();
  });

  test('Click Sign Up link navigates to registration page', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('http://localhost:9999/auth/login');
    
    // 2. Click the 'Đăng ký ngay' (Sign up) link
    await page.getByRole('link', { name: 'Đăng ký ngay' }).click();
    
    // Verify navigation to registration page
    await expect(page).toHaveURL('http://localhost:9999/auth/register');
    
    // Verify the page displays 'Tạo tài khoản mới' heading
    await expect(page.getByRole('heading', { name: 'Tạo tài khoản mới' })).toBeVisible();
    
    // Verify the page shows fields for full name, email, password, and password confirmation
    await expect(page.getByRole('textbox', { name: 'Họ và tên' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Mật khẩu' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Xác nhận mật khẩu' })).toBeVisible();
  });

  test('Back link on forgot password page returns to login', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('http://localhost:9999/auth/login');
    
    // 2. Click the forgot password link
    await page.getByRole('link', { name: 'Quên mật khẩu?' }).click();
    
    // Verify we're on forgot password page
    await expect(page).toHaveURL('http://localhost:9999/auth/forgot-password');
    
    // 3. Click the 'Quay lại đăng nhập' (Back to Login) link
    await page.getByRole('link', { name: 'Quay lại đăng nhập' }).click();
    
    // Verify navigation back to login page
    await expect(page).toHaveURL('http://localhost:9999/auth/login');
  });

  test('Browser back button from forgot password page returns to login', async ({ page }) => {
    // 1. Navigate to the login page and click the forgot password link
    await page.goto('http://localhost:9999/auth/login');
    await page.getByRole('link', { name: 'Quên mật khẩu?' }).click();
    
    // Wait for navigation and verify we're on forgot password page
    await expect(page).toHaveURL('http://localhost:9999/auth/forgot-password');
    
    // 2. Click the browser back button (using Playwright's goBack)
    await page.goBack();
    
    // Verify navigation back to login page
    await expect(page).toHaveURL('http://localhost:9999/auth/login');
  });
});
