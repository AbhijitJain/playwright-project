import * as XLSX from "xlsx";
import * as ExcelJS from "exceljs";
import * as fs from "fs";


// ✅ Global Data Store
let testCaseData: any = null;
export let currentTestCaseId: any = null;

export function setTestCaseData(data: any): void {
  testCaseData = data;
}

export function getTestCaseData(): any {
  return testCaseData;
}
function getRowByTestCaseId(
  filePath: string,
  sheetName: string,
  testCaseId: string
): Record<string, any> | undefined {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];
  //  const data = XLSX.utils.sheet_to_json(sheet, { defval: '', header: 0 });
  const data = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
    defval: "",
    header: 0,
  });

  return data.find((row: any) => row.TestCaseID === testCaseId);
}






export function getRowByTestCaseIdKindredTest(testCaseId: any) {
  // const excelFilePath =
  const excelFilePath = "././Automation_Saucedemo/DataFiles/InputData.xlsx";

  const sheetName = "KindredTest"; // Change if your sheet name is different

  const result = getRowByTestCaseId(excelFilePath, sheetName, testCaseId);
  currentTestCaseId = testCaseId;

  setTestCaseData(result);
  return result;
}

export async function writeToExcelKindredTest(testCaseId: any, TcStatus: any) {
  const excelFilePath = "././Automation_Saucedemo/DataFiles/InputData.xlsx";

  const sheetName = "KindredTest"; // Change if your sheet name is different
  await updateTestCaseStatus(excelFilePath, sheetName, testCaseId, TcStatus);
}


export async function updateTestCaseStatus(
  filePath: string,
  sheetName: string,
  testCaseId: string,
  newValue: string
): Promise<void> {
  if (!fs.existsSync(filePath)) {
    console.error("❌ Excel file not found.");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet(sheetName);
  if (!worksheet) {
    console.error(`❌ Sheet "${sheetName}" not found.`);
    return;
  }

  let rowFound = false;
  // console.log("Excel new");

  worksheet.eachRow((row) => {
    const cell = row.getCell(1); // Column A
    if (cell.value === testCaseId) {
      const statusCell = row.getCell(4);
      //  row.getCell(4).value = newValue; // Column D

      // Normalize the status text for writing
      let formattedStatus = "";

      if (newValue.toLowerCase() === "passed") {
        formattedStatus = "Passed";
        // statusCell.value = formattedStatus;
        // statusCell.font = { bold: true }; // Green

        //       statusCell.font = { color: { argb: "FF008000" }, bold: true }; // Green
      } else if (newValue.toLowerCase() === "failed") {
        formattedStatus = "Failed";
        // statusCell.value = formattedStatus;

        // statusCell.font = { color: { argb: "FFFF0000" }, bold: true }; // Red
      } else if (newValue.toLowerCase() === "timedout") {
        formattedStatus = "Failed Incomplete Execution";
        // statusCell.value = formattedStatus;

        // statusCell.font = { color: { argb: "FFFF0000" }, bold: true }; // Red
      } else {
        formattedStatus = newValue; // Use original input if not recognized
        // statusCell.value = formattedStatus;
      }

      // Write the formatted text into the cell
      statusCell.value = formattedStatus;
      //  statusCell.font = { bold: true };
      rowFound = true;
    }
  });

  if (!rowFound) {
    console.error(`❌ TestCaseID "${testCaseId}" not found in column A.`);
    return;
  }

  await workbook.xlsx.writeFile(filePath);
  console.log(`✅ Updated "${testCaseId}" with "${newValue}" in Status column`);
}
