import { test, expect, Page } from "@playwright/test";
import { LoginPage } from '../Functions/LoginPage';
import { ProductsPage } from '../Functions/ProductsPage';
import { CartPage } from '../Functions/CartPage';
import { CheckoutPage } from '../Functions/CheckoutPage';
import { CheckoutOverviewPage } from '../Functions/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../Functions/CheckoutCompletePage';
import {
  getRowByTestCaseIdKindredTest,
  writeToExcelKindredTest,
  currentTestCaseId,
} from "../Library/excelLibrary";
import { performAction, captureScreenshot } from "../Library/elementsUtils";

let product: string; 

let loginPage: LoginPage;
let productsPage: ProductsPage;
let cartPage: CartPage;
let checkoutPage: CheckoutPage;
let overviewPage: CheckoutOverviewPage;
let completePage: CheckoutCompletePage;

test.beforeEach(async ({ page }) => {
  // Initialize page objects
  loginPage = new LoginPage(page);
  productsPage = new ProductsPage(page);
  cartPage = new CartPage(page);
  checkoutPage = new CheckoutPage(page);
  overviewPage = new CheckoutOverviewPage(page);
  completePage = new CheckoutCompletePage(page);

  // Login before each test
  await loginPage.goto();
});

test.afterEach(async ({ }, testInfo) => {
  // Logout after each test
  await completePage.logout();
    // <--- testInfo here
  console.log("Test status:" + currentTestCaseId, testInfo.status);
  await writeToExcelKindredTest(currentTestCaseId, testInfo.status);
  console.log("Test completed, cleaning up...");

});

test('TC_001 Checkout - Sauce Labs Bike Light', async ({ page }) => {

//Test data from Excel 
    const data = getRowByTestCaseIdKindredTest("TC_001") as
      | Record<string, any>
      | undefined;

  // Login into Account
    await loginPage.login(data?.["username"], data?.["password"]);

  // Add product and verify in cart
   product = data?.["product"]
  await productsPage.addProductToCart(product);
  await productsPage.openCart();
  await cartPage.verifyProductInCart(product);

  // Checkout process
  await cartPage.checkout();
  await checkoutPage.enterInformation(data?.["firstName"], data?.["lastName"],data?.["zip"] );
  await checkoutPage.continue();

  // Verify details
  await overviewPage.verifyProductDetails(product, '$9.99');
  await overviewPage.verifyPaymentInfo('SauceCard #31337');
  await overviewPage.verifyShippingInfo('Free Pony Express Delivery!');
  await overviewPage.verifyPriceDetails('$9.99', '$0.80', '$10.79');
  await captureScreenshot(page,currentTestCaseId);

  // Finish and verify
  await overviewPage.finish();
  await completePage.verifyThankYouMessage();
});
