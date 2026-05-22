// spec: specs/auth-feature.testplan.md
// seed: tests/seed.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Remember Me Functionality', () => {
  test('Remember me checkbox is checked by default', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('/auth/login');
    
    // Verify the 'Ghi nhớ đăng nhập' (Remember me) checkbox is checked by default
    const rememberMeCheckbox = page.getByRole('checkbox', { name: 'Ghi nhớ đăng nhập' });
    await expect(rememberMeCheckbox).toBeChecked();
  });

  test('Toggle remember me checkbox', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('/auth/login');
    
    // Verify checkbox is initially checked
    const rememberMeCheckbox = page.getByRole('checkbox', { name: 'Ghi nhớ đăng nhập' });
    await expect(rememberMeCheckbox).toBeChecked();
    
    // 2. Click the remember me checkbox to uncheck it
    await rememberMeCheckbox.click();
    
    // Verify checkbox is now unchecked
    await expect(rememberMeCheckbox).not.toBeChecked();
    
    // 3. Click the remember me checkbox again to check it
    await rememberMeCheckbox.click();
    
    // Verify checkbox is checked again
    await expect(rememberMeCheckbox).toBeChecked();
  });
});
