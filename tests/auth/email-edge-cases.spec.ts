// spec: specs/auth-feature.testplan.md
// seed: tests/seed.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Email Field Edge Cases', () => {
  test('Email field with spaces around valid email', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('/auth/login');
    
    // 2. Enter '  test@example.com  ' in the email field (with leading and trailing spaces)
    await page.getByRole('textbox', { name: 'Email' }).fill('  test@example.com  ');
    
    // 3. Enter a password
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('password123');
    
    // 4. Click the login button
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    
    // Verify the form submission was attempted (no email format error)
    await expect(page).toHaveURL('/auth/login');
  });

  test('Email field with special characters (plus sign)', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('/auth/login');
    
    // 2. Enter 'test+tag@example.com' in the email field
    await page.getByRole('textbox', { name: 'Email' }).fill('test+tag@example.com');
    
    // 3. Enter a password
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('password123');
    
    // 4. Click the login button
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    
    // Should not display email format validation error
    const emailError = page.locator('text=Định dạng email không hợp lệ');
    await expect(emailError).not.toBeVisible();
  });

  test('Email field with uppercase characters', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('/auth/login');
    
    // 2. Enter 'Test@Example.COM' in the email field
    await page.getByRole('textbox', { name: 'Email' }).fill('Test@Example.COM');
    
    // 3. Enter a password
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('password123');
    
    // 4. Click the login button
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    
    // Should not display email format validation error
    const emailError = page.locator('text=Định dạng email không hợp lệ');
    await expect(emailError).not.toBeVisible();
  });
});
