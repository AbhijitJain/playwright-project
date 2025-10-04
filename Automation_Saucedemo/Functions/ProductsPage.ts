import { Page, expect } from '@playwright/test';

export class ProductsPage {
  constructor(private page: Page) {}

  // Page locators
  cartLink = this.page.locator('[data-test="shopping-cart-link"]');

  // Dynamic locator for "Add to cart" by product name
  addToCartButton(productName: string) {
    return this.page.locator('.inventory_item', { hasText: productName })
                    .getByRole('button', { name: 'Add to cart' });
  }

  // Actions
  async addProductToCart(productName: string) {
    const button = this.addToCartButton(productName);
    await expect(button).toBeVisible();
    await button.click();
  }

  async openCart() {
    await expect(this.cartLink).toBeVisible();
    await this.cartLink.click();
  }
}
