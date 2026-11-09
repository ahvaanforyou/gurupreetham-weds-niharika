/**
 * =======================================================================
 * 🌸 GELLI GURUPREETHAM & NAGELLA SAI NIHARIKA WEDDING 🌸
 * GOOGLE SHEETS RSVP WEBHOOK & EXECUTIVE DASHBOARD
 * =======================================================================
 * 
 * FEATURES:
 * 1. ROYAL NAVY & GOLD EXECUTIVE DASHBOARD (Rows 1–3):
 *    - Total Responses: COUNTA(B8:B)
 *    - Total Headcount / Guests: SUM(D8:D)
 *    - Haldi Headcount: COUNTIFS(E8:E, "Attending", F8:F, "*Haldi*")
 *    - Wedding Muhurtham Headcount: COUNTIFS(E8:E, "Attending", F8:F, "*Muhurtham*")
 *    - Rayadurgam Reception Headcount: COUNTIFS(E8:E, "Attending", F8:F, "*Rayadurgam*")
 *    - Anantapur Reception Headcount: COUNTIFS(E8:E, "Attending", F8:F, "*Anantapur*")
 *    - Declined Count: COUNTIF(E8:E, "Declined")
 * 
 * 2. STRUCTURED GUEST DATA COLUMNS (Rows 7+):
 *    - Col A: Timestamp
 *    - Col B: Guest / Family Name
 *    - Col C: Phone / WhatsApp Number
 *    - Col D: Total Guests
 *    - Col E: Attendance Status (Attending / Declined with badge styling)
 *    - Col F: Events Attending
 *    - Col G: Warm Wishes / Blessings
 * 
 * 3. SMART IN-PLACE ROW EDITING:
 *    - When a guest edits their response on the website, it locates their existing row
 *      by phone number or name and updates that EXACT row in-place!
 *    - Prevents duplicate rows and keeps dashboard formulas 100% accurate.
 * 
 * =======================================================================
 * HOW TO SET UP (Takes ~1 minute):
 * 1. Open Google Sheets (https://sheets.new)
 *    Rename the active sheet tab at the bottom to: "RSVP Responses"
 * 2. In Google Sheets top menu, click Extensions > Apps Script.
 * 3. Delete any default code in Code.gs, and PASTE THIS ENTIRE SCRIPT.
 * 4. Press Ctrl + S to save.
 * 5. In the toolbar at the top, select the function "setupSheet" from the dropdown.
 * 6. Click "Run" (▶).
 *    - If Google asks for permissions: Click "Review permissions" -> Select your account ->
 *      Click "Advanced" -> Click "Go to Untitled project (unsafe)" -> Click "Allow".
 *    - You will see the Royal Navy & Gold Executive Dashboard appear in your sheet!
 * 7. Click the blue "Deploy" button (top right) > "New deployment".
 *    - Click gear icon (Select type) > Choose "Web app".
 *    - Description: "Gurupreetham & Niharika RSVP Webhook"
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone" (CRITICAL: Do NOT choose "Only myself")
 *    - Click "Deploy".
 * 8. Copy the Web App URL (starts with https://script.google.com/macros/s/.../exec).
 * 9. Paste this URL into `GOOGLE_SHEET_WEBHOOK_URL` in `script.js`!
 * =======================================================================
 */

var SHEET_NAME = "RSVP Responses";

var HEADERS = [
  "Timestamp",
  "Guest / Family Name",
  "Phone / WhatsApp Number",
  "Total Guests",
  "Attendance Status",
  "Events Attending",
  "Warm Wishes / Blessings"
];

/**
 * Normalizes phone numbers to digits only for accurate matching
 */
function cleanPhone(p) {
  if (!p) return "";
  return String(p).replace(/\D/g, "");
}

/**
 * Normalizes text for clean comparison
 */
function cleanText(t) {
  if (!t) return "";
  return String(t).trim().toLowerCase();
}

/**
 * Searches the sheet to find an existing row for this guest.
 * Returns the 1-based row number (e.g. 8, 9...) if found, or -1 if new.
 */
function findExistingRowIndex(sheet, data, startRow) {
  var lastRow = sheet.getLastRow();
  if (lastRow < startRow) return -1;

  var numRows = lastRow - startRow + 1;
  var values = sheet.getRange(startRow, 2, numRows, 2).getValues();

  var targetPhone = cleanPhone(data.phone || data.contact || data.tel);
  var targetName = cleanText(data.name || data.fullName);

  // 1. Primary check: Phone match (search newest rows first)
  if (targetPhone && targetPhone.length >= 7) {
    for (var i = values.length - 1; i >= 0; i--) {
      var rowPhone = cleanPhone(values[i][1]); // Col C
      if (rowPhone && rowPhone.length >= 7) {
        if (rowPhone === targetPhone || rowPhone.slice(-10) === targetPhone.slice(-10)) {
          return startRow + i;
        }
      }
    }
  }

  // 2. Secondary check: Name match
  if (targetName && targetName.length > 2) {
    for (var j = values.length - 1; j >= 0; j--) {
      var rowName = cleanText(values[j][0]); // Col B
      if (rowName && rowName === targetName) {
        return startRow + j;
      }
    }
  }

  return -1; // New guest RSVP
}

/**
 * INITIALIZES THE ROYAL NAVY & GOLD EXECUTIVE DASHBOARD
 */
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getActiveSheet();
    sheet.setName(SHEET_NAME);
  }

  sheet.clear();
  sheet.setFrozenRows(0);
  sheet.setFrozenColumns(0);

  // Row 1: Grand Banner
  sheet.getRange("A1:G1").merge();
  sheet.getRange("A1").setValue("🌸 GELLI GURUPREETHAM & NAGELLA SAI NIHARIKA WEDDING CELEBRATION 🌸")
    .setFontFamily("Georgia")
    .setFontSize(14)
    .setFontWeight("bold")
    .setFontColor("#FFFFFF")
    .setBackground("#0C1C40")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 38);

  // Row 2: Subtitle Banner
  sheet.getRange("A2:G2").merge();
  sheet.getRange("A2").setValue("Rayadurgam (21 - 23 Dec 2026) · Anantapur Grand Reception (25 Dec 2026) | Executive RSVP Tracker")
    .setFontFamily("Arial")
    .setFontSize(9)
    .setFontColor("#E6C265")
    .setBackground("#07122A")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(2, 22);

  // Row 3: KPI Metric Cards
  sheet.getRange("A3").setValue("TOTAL RESPONSES").setFontWeight("bold").setFontSize(9).setBackground("#F8FAFC").setFontColor("#475569").setHorizontalAlignment("center");
  sheet.getRange("B3").setValue("TOTAL GUESTS").setFontWeight("bold").setFontSize(9).setBackground("#F8FAFC").setFontColor("#475569").setHorizontalAlignment("center");
  sheet.getRange("C3").setValue("HALDI ATTENDING").setFontWeight("bold").setFontSize(9).setBackground("#F8FAFC").setFontColor("#475569").setHorizontalAlignment("center");
  sheet.getRange("D3").setValue("MUHURTHAM ATTENDING").setFontWeight("bold").setFontSize(9).setBackground("#F8FAFC").setFontColor("#475569").setHorizontalAlignment("center");
  sheet.getRange("E3").setValue("RAYADURGAM RECEPTION").setFontWeight("bold").setFontSize(9).setBackground("#F8FAFC").setFontColor("#475569").setHorizontalAlignment("center");
  sheet.getRange("F3").setValue("ANANTAPUR RECEPTION").setFontWeight("bold").setFontSize(9).setBackground("#F8FAFC").setFontColor("#475569").setHorizontalAlignment("center");
  sheet.getRange("G3").setValue("DECLINED").setFontWeight("bold").setFontSize(9).setBackground("#F8FAFC").setFontColor("#475569").setHorizontalAlignment("center");
  sheet.setRowHeight(3, 24);

  // Row 4: KPI Live Formulas
  sheet.getRange("A4").setFormula('=COUNTA(B8:B)').setFontFamily("Arial").setFontSize(16).setFontWeight("bold").setFontColor("#0C1C40").setBackground("#FFFFFF").setHorizontalAlignment("center");
  sheet.getRange("B4").setFormula('=SUM(D8:D)').setFontFamily("Arial").setFontSize(16).setFontWeight("bold").setFontColor("#B8860B").setBackground("#FFFFFF").setHorizontalAlignment("center");
  sheet.getRange("C4").setFormula('=COUNTIFS(E8:E, "Attending", F8:F, "*Haldi*")').setFontFamily("Arial").setFontSize(14).setFontWeight("bold").setFontColor("#B45309").setBackground("#FFFFFF").setHorizontalAlignment("center");
  sheet.getRange("D4").setFormula('=COUNTIFS(E8:E, "Attending", F8:F, "*Muhurtham*")').setFontFamily("Arial").setFontSize(14).setFontWeight("bold").setFontColor("#0C1C40").setBackground("#FFFFFF").setHorizontalAlignment("center");
  sheet.getRange("E4").setFormula('=COUNTIFS(E8:E, "Attending", F8:F, "*Rayadurgam*")').setFontFamily("Arial").setFontSize(14).setFontWeight("bold").setFontColor("#0C1C40").setBackground("#FFFFFF").setHorizontalAlignment("center");
  sheet.getRange("F4").setFormula('=COUNTIFS(E8:E, "Attending", F8:F, "*Anantapur*")').setFontFamily("Arial").setFontSize(14).setFontWeight("bold").setFontColor("#0C1C40").setBackground("#FFFFFF").setHorizontalAlignment("center");
  sheet.getRange("G4").setFormula('=COUNTIF(E8:E, "Declined")').setFontFamily("Arial").setFontSize(14).setFontWeight("bold").setFontColor("#64748B").setBackground("#FFFFFF").setHorizontalAlignment("center");
  sheet.setRowHeight(4, 34);

  // Row 5: Thin Border Line
  sheet.getRange("A5:G5").setBackground("#E2E8F0");
  sheet.setRowHeight(5, 4);

  // Row 6: Empty Spacer
  sheet.getRange("A6:G6").setBackground("#FFFFFF");
  sheet.setRowHeight(6, 10);

  // Row 7: Table Headers
  var headerRange = sheet.getRange(7, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS])
    .setFontFamily("Georgia")
    .setFontSize(10)
    .setFontWeight("bold")
    .setFontColor("#FFFFFF")
    .setBackground("#0C1C40")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setWrap(true);
  sheet.setRowHeight(7, 32);

  // Column Widths
  sheet.setColumnWidth(1, 175); // Timestamp
  sheet.setColumnWidth(2, 220); // Guest Name
  sheet.setColumnWidth(3, 160); // Phone
  sheet.setColumnWidth(4, 110); // Guests
  sheet.setColumnWidth(5, 140); // Status
  sheet.setColumnWidth(6, 260); // Events Attending
  sheet.setColumnWidth(7, 300); // Warm Wishes

  sheet.setFrozenRows(7);

  // Add Sample Starter Row
  var now = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  var sampleRow = [
    now,
    "Dr. K. Srinivas & Family",
    "+91 98765 43210",
    3,
    "Attending",
    "Haldi, Reception (Rayadurgam), Wedding Muhurtham",
    "Heartiest congratulations to Gurupreetham & Sai Niharika! Wishing you eternal happiness."
  ];
  sheet.appendRow(sampleRow);
  formatDataRow(sheet, 8, "Attending");

  Logger.log("✅ SUCCESS! Dashboard initialized with live Wedding metrics!");
  return "SUCCESS: Dashboard initialized with live Wedding metrics!";
}

/**
 * Styles a guest row with clean fonts and badge styling
 */
function formatDataRow(sheet, rowNum, status) {
  var rowRange = sheet.getRange(rowNum, 1, 1, 7);
  rowRange.setFontFamily("Arial")
    .setFontSize(10)
    .setVerticalAlignment("middle")
    .setBorder(true, true, true, true, true, true, "#E2E8F0", SpreadsheetApp.BorderStyle.SOLID);

  sheet.setRowHeight(rowNum, 28);

  // Center Total Guests and Attendance Status
  sheet.getRange(rowNum, 4, 1, 2).setHorizontalAlignment("center");
  sheet.getRange(rowNum, 4).setFontWeight("bold");

  // Badge colors for Attendance Status (Col E)
  var cellStatus = sheet.getRange(rowNum, 5);
  if (status === "Attending") {
    cellStatus.setBackground("#EBF3FE").setFontColor("#0C1C40").setFontWeight("bold");
  } else {
    cellStatus.setBackground("#F1F5F9").setFontColor("#64748B").setFontWeight("normal");
  }
}

/**
 * Ensures table structure exists before receiving webhooks
 */
function ensureInitialized(sheet) {
  if (sheet.getLastRow() < 7 || sheet.getRange(7, 1).getValue() !== "Timestamp") {
    setupSheet();
  }
}

/**
 * Handles RSVP submissions and edits from the website
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.getActiveSheet();
      sheet.setName(SHEET_NAME);
    }
    ensureInitialized(sheet);

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var startRow = 8;
    var baseTimestamp = data.timestamp 
      ? new Date(data.timestamp).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }) 
      : new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    var name = (data.name || data.fullName || "-").toString().trim();
    var phone = (data.phone || data.contact || "-").toString().trim();
    var attending = (data.attending === "yes" || data.attending === "Attending" || data.attending === true) ? "Attending" : "Declined";
    
    var guestCount = 0;
    if (attending === "Attending") {
      guestCount = Number(data.guests !== undefined ? data.guests : (data.guestCount || data.guest_count || 1));
      if (isNaN(guestCount) || guestCount <= 0) {
        guestCount = 1;
      }
    }

    var events = (attending === "Attending") ? (data.events || "All Celebrations") : "None";
    var message = (data.message || data.note || data.warm_wishes || "-").toString().trim();

    // Check for existing RSVP (Smart In-Place Row Edit)
    var existingRow = findExistingRowIndex(sheet, data, startRow);
    var isUpdate = (existingRow > 0);
    var targetRow = isUpdate ? existingRow : Math.max(startRow, sheet.getLastRow() + 1);
    var displayTimestamp = isUpdate ? (baseTimestamp + " (Edited)") : baseTimestamp;

    var rowValues = [
      displayTimestamp,
      name,
      phone,
      guestCount,
      attending,
      events,
      message
    ];

    sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
    formatDataRow(sheet, targetRow, attending);

    SpreadsheetApp.flush();

    var actionTaken = isUpdate ? "updated" : "created";
    Logger.log("RSVP " + actionTaken + " successfully at row " + targetRow + " for " + name);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      action: actionTaken,
      message: isUpdate ? "RSVP updated in Google Sheets" : "RSVP recorded in Google Sheets",
      name: name,
      rowNumber: targetRow
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Health check endpoint for testing in browser
 */
function doGet(e) {
  return ContentService.createTextOutput("🌸 Gelli Gurupreetham & Nagella Sai Niharika Wedding RSVP Webhook is ACTIVE and connected! Ready to receive RSVPs.")
    .setMimeType(ContentService.MimeType.TEXT);
}
