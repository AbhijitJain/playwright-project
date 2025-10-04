import { Page, expect } from '@playwright/test';

export class CheckoutCompletePage {
  constructor(private page: Page) {}

  // Page locators
  thankYouHeading = this.page.getByRole('heading', { name: 'Thank you for your order!' });
  orderMessage = this.page.getByText(/Your order has been dispatched/);
  menuButton = this.page.getByRole('button', { name: 'Open Menu' });
  logoutLink = this.page.getByRole('link', { name: 'Logout' });

  // Actions
  async verifyThankYouMessage() {
    await expect(this.thankYouHeading).toBeVisible();
    await expect(this.orderMessage).toBeVisible();
  }

  async logout() {
    await expect(this.menuButton).toBeVisible();
    await this.menuButton.click();
    await expect(this.logoutLink).toBeVisible();
    await this.logoutLink.click();
    await expect(this.page).toHaveURL('https://www.saucedemo.com/');
  }
}
