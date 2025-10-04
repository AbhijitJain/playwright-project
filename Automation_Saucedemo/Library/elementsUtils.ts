import { Page, Locator, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

type LocatorType =
  | "role"
  | "text"
  | "label"
  | "placeholder"
  | "css"
  | "id"
  | "name"
  | "xpath"
  | "class";

export type ActionType =
  | "fill"
  | "click"
  | "selectByValue"
  | "selectByLabel"
  | "selectByIndex"
  | "check"
  | "uncheck"
  | "clear";

type RoleOptions = {
  role: Parameters<Page["getByRole"]>[0];
  options?: Parameters<Page["getByRole"]>[1];
};

let _page: Page | undefined;

export function setPage(page: Page) {
  _page = page;
}

export function getPage(): Page {
  if (!_page) {
    throw new Error("Page has not been set");
  }
  return _page;
}

export async function getLocatorBy(
  locatorType: LocatorType,
  locatorValue: string | RoleOptions
): Promise<Locator> {
  const _page = getPage();
  switch (locatorType) {
    case "role": {
      const { role, options } = locatorValue as RoleOptions;
      return _page.getByRole(role, options);
    }
    case "text":
      return _page.getByText(locatorValue as string);
    case "label":
      return _page.getByLabel(locatorValue as string);
    case "placeholder":
      return _page.getByPlaceholder(locatorValue as string);
    case "css":
      return _page.locator(locatorValue as string);
    case "id":
      return _page.locator(`#${locatorValue}`);
    case "name":
      return _page.locator(`[name="${locatorValue}"]`);
    case "xpath":
      return _page.locator(`xpath=${locatorValue}`);

    case "class":
      return _page.locator(`.${locatorValue}`);
    default:
      throw new Error(`Unsupported locator type: ${locatorType}`);
  }
}

export async function performAction(
  locatorType: LocatorType,
  locatorValue: string | RoleOptions,
  action: ActionType,
  value?: string | number
): Promise<void> {
  const locator = await getLocatorBy(locatorType, locatorValue);

  switch (action) {
    case "fill":
      // if (typeof value === 'string') {
      await locator.fill(String(value));
      //} else {
      //  throw new Error(`'fill' action requires a string value.`);
      //}
      break;

    case "click":
      await locator.click();
      break;

    case "selectByValue":
      if (typeof value === "string") {
        await locator.selectOption({ value });
      } else {
        throw new Error(`'selectByValue' requires a string value.`);
      }
      break;

    case "selectByLabel":
      if (typeof value === "string") {
        await locator.selectOption({ label: value });
      } else {
        throw new Error(`'selectByLabel' requires a string value.`);
      }
      break;

    case "selectByIndex":
      if (typeof value === "number") {
        await locator.selectOption({ index: value });
      } else {
        throw new Error(`'selectByIndex' requires a number value.`);
      }
      break;

    case "check":
      if (!(await locator.isChecked())) {
        await locator.check();
      }
      break;

    case "uncheck":
      if (await locator.isChecked()) {
        await locator.uncheck();
      }
      break;

    case "clear":
      await locator.fill("");
      break;

    default:
      throw new Error(`Unsupported action type: ${action}`);
  }
}

// await performAction('label', 'Username', 'fill', 'john_doe');
// await performAction('text', 'Submit', 'click');
// await performAction('name', 'country', 'selectByValue', 'US');
// await performAction('id', 'newsletter', 'check');

export type VerificationType =
  | "isVisible"
  | "isHidden"
  | "isChecked"
  | "isNotChecked"
  | "hasText"
  | "toContainText"
  | "hasValue"
  | "hasAttribute";

export async function verifyAction(
  locatorType: LocatorType,
  locatorValue: string,
  verification: VerificationType,
  expectedValue?: string
): Promise<void> {
  const locator: Locator = await getLocatorBy(locatorType, locatorValue);
  const expectFn = expect.soft; // Always soft assertion

  switch (verification) {
    case "isVisible":
      await expectFn(locator).toBeVisible();
      break;

    case "isHidden":
      await expectFn(locator).toBeHidden();
      break;

    case "isChecked":
      await expectFn(locator).toBeChecked();
      break;

    case "isNotChecked":
      await expectFn(locator).not.toBeChecked();
      break;

    case "hasText":
      if (typeof expectedValue !== "string") {
        throw new Error(
          `'hasText' verification requires a string expected value.`
        );
      }
      await expectFn(locator).toHaveText(expectedValue);
      break;

    case "toContainText":
      if (typeof expectedValue !== "string") {
        throw new Error(
          `'toContainText' verification requires a string expected value.`
        );
      }
      await expectFn(locator).toContainText(expectedValue);
      break;

    case "hasValue":
      if (typeof expectedValue !== "string") {
        throw new Error(
          `'hasValue' verification requires a string expected value.`
        );
      }
      await expectFn(locator).toHaveValue(expectedValue);
      break;

    case "hasAttribute":
      if (typeof expectedValue !== "string" || !expectedValue.includes("=")) {
        throw new Error(
          `'hasAttribute' verification requires a string in the format "attr=value".`
        );
      }
      const [attr, expectedAttrValue] = expectedValue.split("=");
      await expectFn(locator).toHaveAttribute(attr, expectedAttrValue);
      break;

    default:
      throw new Error(`Unsupported verification type: ${verification}`);
  }
}

//  // 1. isVisible
//  await verifyAction('text', 'Login', 'isVisible');

//  // 2. isHidden
//  await verifyAction('id', 'loadingSpinner', 'isHidden');

//  // 3. isChecked
//  await verifyAction('id', 'termsCheckbox', 'isChecked');

//  // 4. isNotChecked
//  await verifyAction('id', 'subscribeNewsletter', 'isNotChecked');

//  // 5. hasText
//  await verifyAction('css', '.success-message', 'hasText', 'Account created successfully');

//  // 6. toContainText
//  await verifyAction('css', '.error-alert', 'toContainText', 'Invalid password');

//  // 7. hasValue
//  await verifyAction('name', 'username', 'hasValue', 'john_doe');

//  // 8. hasAttribute
//  await verifyAction('id', 'submitButton', 'hasAttribute', 'disabled=true');



// await verifyAction('label', 'Username', 'hasValue', 'john_doe');
// await verifyAction('text', 'Submit', 'isVisible');
// await verifyAction('id', 'newsletter', 'isChecked');
// await verifyAction('name', 'country', 'hasValue', 'US');
// await verifyAction('css', '.alert-message', 'hasText', 'Submission successful');
// await verifyAction('id', 'submitBtn', 'hasAttribute', 'disabled=true');

export async function captureScreenshot(
  page: Page,
  testcaseId: string
): Promise<void> {
  // const page = getPage();

  // const baseDir = "C:\\Automation\\Automation_Infynity\\ScreenShot";
  const baseDir = "././Automation_Saucedemo/ScreenShot";
  // console.log(`📸 Screenshot saved at: ${baseDir}`);
  const folderPath = path.join(baseDir, testcaseId);
  // console.log(`📸 Screenshot saved at: ${folderPath}`);

  // Create folder if it doesn't exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Find the next screenshot number
  const existingFiles = fs.readdirSync(folderPath);
  const screenshotNumbers = existingFiles
    .map((file) => {
      const match = file.match(new RegExp(`^${testcaseId}_(\\d+)\\.png$`));
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((num): num is number => num !== null);

  const nextNumber =
    screenshotNumbers.length > 0 ? Math.max(...screenshotNumbers) + 1 : 1;
  const fileName = `${testcaseId}_${nextNumber}.png`;
  const filePath = path.join(folderPath, fileName);

  await page.screenshot({ path: filePath, fullPage: true });

  console.log(`📸 Screenshot saved at: ${filePath}`);
}

export function getTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

/**
 * Captures a full-page screenshot with a timestamp-based filename.

 * @param testcaseId A unique test case identifier (used to group screenshots)
 */
