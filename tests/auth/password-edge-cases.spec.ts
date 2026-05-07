// spec: specs/auth-feature.testplan.md
// seed: tests/seed.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Password Field Edge Cases', () => {
  test('Password field with special characters', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('http://localhost:9999/auth/login');
    
    // 2. Enter 'Pass!@#$%^&*()' in the password field containing special characters
    await page.getByRole('textbox', { name: 'Mất khẩu' }).fill('Pass!@#$%^&*()');
    
    // 3. Enter a valid email
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    
    // 4. Click the login button
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    
    // Verify the form submits (password with special characters is accepted)
    await page.waitForTimeout(500);
    
    // Should not display password validation error
    const passwordError = page.locator('text=Vui lòng nhập Mật khẩu');
    await expect(passwordError).not.toBeVisible();
  });

  test('Password field with spaces', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('http://localhost:9999/auth/login');
    
    // 2. Enter 'pass word 123' in the password field which includes spaces
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('pass word 123');
    
    // 3. Enter a valid email
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    
    // 4. Click the login button
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    
    // Verify the form accepts password with spaces
    await page.waitForTimeout(500);
    
    // Should not display password validation error
    const passwordError = page.locator('text=Vui lòng nhập Mật khẩu');
    await expect(passwordError).not.toBeVisible();
  });

  test('Password field with very long password', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('http://localhost:9999/auth/login');
    
    // 2. Enter a very long password (100+ characters)
    const longPassword = 'A'.repeat(150);
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill(longPassword);
    
    // 3. Enter a valid email
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    
    // 4. Click the login button
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    
    // Verify the form accepts long password
    await page.waitForTimeout(500);
    
    // Should not display password validation error
    const passwordError = page.locator('text=Vui lòng nhập Mật khẩu');
    await expect(passwordError).not.toBeVisible();
  });
});
