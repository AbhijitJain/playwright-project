import { Page, expect } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  // Page locators
  firstNameInput = this.page.getByPlaceholder('First Name');
  lastNameInput = this.page.getByPlaceholder('Last Name');
  zipInput = this.page.getByPlaceholder('Zip/Postal Code');
  continueButton = this.page.getByRole('button', { name: 'Continue' });
  overviewTitle = this.page.getByText('Checkout: Overview');

  // Actions
  async enterInformation(firstName: string, lastName: string, zip: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipInput.fill(zip);
  }

  async continue() {
    await expect(this.continueButton).toBeVisible();
    await this.continueButton.click();
    await expect(this.overviewTitle).toBeVisible();
  }
}
