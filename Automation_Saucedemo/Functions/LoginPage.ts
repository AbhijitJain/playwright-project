import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  // Page locators
  usernameInput = this.page.getByPlaceholder('Username');
  passwordInput = this.page.getByPlaceholder('Password');
  loginButton = this.page.getByRole('button', { name: 'Login' });
  productsTitle = this.page.getByText('Products');

  // Navigate to login page
  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
    await expect(this.page).toHaveTitle(/Swag Labs/);
  }

  // Perform login
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(this.productsTitle).toBeVisible();
  }
}
