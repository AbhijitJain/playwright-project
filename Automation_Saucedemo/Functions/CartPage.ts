import { Page, expect } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  // Page locators
  checkoutButton = this.page.getByRole('button', { name: 'Checkout' });
  checkoutTitle = this.page.getByText('Checkout: Your Information');

  // Dynamic locator for product in cart
  productInCart(productName: string) {
    return this.page.getByText(productName);
  }

  // Actions
  async verifyProductInCart(productName: string) {
    const product = this.productInCart(productName);
    await expect(product).toBeVisible();
  }

  async checkout() {
    await expect(this.checkoutButton).toBeVisible();
    await this.checkoutButton.click();
    await expect(this.checkoutTitle).toBeVisible();
  }
}
