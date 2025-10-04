import { Page, expect } from '@playwright/test';

export class CheckoutOverviewPage {
  constructor(private page: Page) {}

  // Page locators
  finishButton = this.page.getByRole('button', { name: 'Finish' });

  // Dynamic locators
  productName(name: string) {
    return this.page.getByText(name);
  }

  paymentInfo(payment: string) {
    return this.page.getByText(payment);
  }

  shippingInfo(shipping: string) {
    return this.page.getByText(shipping);
  }

  priceDetail(label: string, amount: string) {
    return this.page.getByText(`${label}: ${amount}`);
  }

  // Actions
  async verifyProductDetails(name: string, price?: string) {
    await expect(this.productName(name)).toBeVisible();
    // Uncomment if needed:
    // await expect(this.page.getByText(price!)).toBeVisible();
  }

  async verifyPaymentInfo(payment: string) {
    await expect(this.paymentInfo(payment)).toBeVisible();
  }

  async verifyShippingInfo(shipping: string) {
    await expect(this.shippingInfo(shipping)).toBeVisible();
  }

  async verifyPriceDetails(itemTotal: string, tax: string, total: string) {
    await expect(this.priceDetail('Item total', itemTotal)).toBeVisible();
    await expect(this.priceDetail('Tax', tax)).toBeVisible();
    await expect(this.priceDetail('Total', total)).toBeVisible();
  }

  async finish() {
    await expect(this.finishButton).toBeVisible();
    await this.finishButton.click();
  }
}
