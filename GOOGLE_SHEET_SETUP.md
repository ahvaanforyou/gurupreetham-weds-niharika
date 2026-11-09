# 🌸 Gurupreetham & Sai Niharika Wedding · Google Sheets RSVP Setup Guide

This guide explains how to connect your website's RSVP form directly to a **Google Sheet** with a live **Executive Dashboard** (tracking Total Responses, Headcount, Event attendance for Haldi, Muhurtham, and both Receptions, and Declined count).

---

### ⏱️ Quick Setup (Takes ~1 Minute):

#### Step 1: Create Your Google Sheet
1. Open [Google Sheets](https://sheets.new) in your browser.
2. Rename the sheet at the top left to: `Gurupreetham & Niharika Wedding RSVPs`.
3. Rename the tab at the very bottom from `Sheet1` to: **`RSVP Responses`**.

#### Step 2: Open Apps Script
1. In the top menu bar, click **Extensions** > **Apps Script**.
2. Delete any existing code in the editor (`function myFunction() { ... }`).

#### Step 3: Paste the Master Script
1. Open [`google-sheet-script.gs`](./google-sheet-script.gs) in this repository.
2. Copy all code and paste it into the Apps Script editor.
3. Click the 💾 **Save** icon (or press `Ctrl + S`).

#### Step 4: Run `setupSheet`
1. In the toolbar at the top of Apps Script, click the function dropdown (it may show `doPost`).
2. Select **`setupSheet`**.
3. Click **▶ Run**.
4. When Google displays **Authorization Required**:
   - Click **Review permissions**.
   - Choose your Google Account.
   - Click **Advanced** (bottom left of popup).
   - Click **Go to Untitled project (unsafe)**.
   - Click **Allow**.
5. Switch back to your Google Sheet:
   - Your **Royal Navy & Gold Executive Dashboard** will appear with live formulas and a sample guest entry!

#### Step 5: Deploy as Webhook
1. In Apps Script, click the blue **Deploy** button (top right) > **New deployment**.
2. Click the gear icon ⚙️ (Select type) > choose **Web app**.
3. Configure the fields:
   - **Description**: `Gurupreetham & Niharika RSVP Webhook`
   - **Execute as**: `Me (your email)`
   - **Who has access**: **`Anyone`** *(⚠️ IMPORTANT: Must be "Anyone" so guests' browsers can submit RSVPs without requiring a Google login)*.
4. Click **Deploy**.
5. Copy the generated **Web App URL** (starts with `https://script.google.com/macros/s/.../exec`).

#### Step 6: Connect to Website
1. Provide the Web App URL in chat or paste it into `script.js` at line 6:
   ```javascript
   const GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
   ```
2. Your website will now instantly record and update all guest RSVPs into your Google Sheet in real time!
