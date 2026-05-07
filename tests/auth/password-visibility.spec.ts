// spec: specs/auth-feature.testplan.md
// seed: tests/seed.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Password Visibility Toggle', () => {
  test('Toggle password visibility from hidden to visible', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('http://localhost:9999/auth/login');
    
    // 2. Enter 'mypassword123' in the password field
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('mypassword123');
    
    // 3. Click the eye icon (visibility toggle) next to the password field
    await page.getByRole('img', { name: 'eye-invisible' }).click();
    
    // Verify password is now visible and eye icon changed
    const passwordInput = page.getByRole('textbox', { name: 'Mật khẩu' });
    await expect(passwordInput).toHaveValue('mypassword123');
    
    // Verify eye icon changed to indicate password is visible
    await expect(page.getByRole('img', { name: 'eye' })).toBeVisible();
  });

  test('Toggle password visibility from visible to hidden', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('http://localhost:9999/auth/login');
    
    // 2. Enter 'mypassword123' in the password field
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('mypassword123');
    
    // 3. Click the eye icon to show the password
    await page.getByRole('img', { name: 'eye-invisible' }).click();
    
    // Verify password is now visible
    await expect(page.getByRole('img', { name: 'eye' })).toBeVisible();
    
    // 4. Click the eye icon again to hide the password
    await page.getByRole('img', { name: 'eye' }).click();
    
    // Verify eye icon changed back to indicate password is hidden
    await expect(page.getByRole('img', { name: 'eye-invisible' })).toBeVisible();
  });
});
