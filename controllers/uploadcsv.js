

const Transaction = require("../models/Transaction");
const XLSX = require("xlsx");
const moment = require("moment");

exports.uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read Excel workbook
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON and normalize headers
    let rows = XLSX.utils.sheet_to_json(sheet, { defval: "" }).map((r) => {
      const normalized = {};
      Object.keys(r).forEach((k) => {
        normalized[k.trim()] = r[k];
      });
      return normalized;
    });

    // Remove completely empty rows
    rows = rows.filter((r) => Object.values(r).some((v) => v !== ""));

    const formattedRecords = [];

    rows.forEach((r, index) => {
      let dateField = r["Transaction Date"];
      let dateValue;

      // Skip empty date
      if (!dateField || dateField.toString().trim() === "") return;

      // Handle Excel numeric dates
      if (typeof dateField === "number") {
        const d = XLSX.SSF.parse_date_code(dateField);
        if (!d) return;
        dateValue = new Date(d.y, d.m - 1, d.d);
      } else {
        // Handle string dates in multiple formats
        const m = moment(dateField, ["DD/MM/YYYY", "MM/DD/YYYY"], true);
        if (!m.isValid()) return;
        dateValue = m.toDate();
      }

      // Determine Amount (Debit = negative, Credit = positive)
      let amount = null;
      if (r["Debit Amount"] && r["Debit Amount"].toString().trim() !== "") {
        amount = -Math.abs(Number(r["Debit Amount"]));
      } else if (
        r["Credit Amount"] &&
        r["Credit Amount"].toString().trim() !== ""
      ) {
        amount = Math.abs(Number(r["Credit Amount"]));
      } else {
        return;
      }

      // Push all required columns
      formattedRecords.push({
        transactionDate: dateValue,
        transactionDescription: r["Transaction Description"] || "",
        transactionType: r["Transaction Type"] || "Uncategorized",
        amount,
        sortCode: r["Sort Code"] || "",
        accountNumber: r["Account Number"] || "",
        balance: r["Balance"] ? Number(r["Balance"]) : 0,
      });
    });

    if (formattedRecords.length === 0) {
      return res.status(400).json({
        message: "No valid transactions found in the uploaded file.",
      });
    }
// validationfor csv
const toInsert = [];
const duplicates = [];

for (let record of formattedRecords) {
  // Check if exact same transaction exists (same date + same other columns)
  const exists = await Transaction.findOne({
    transactionDate: record.transactionDate, // date bhi check
    transactionDescription: record.transactionDescription.trim(),
    amount: record.amount,
    transactionType: record.transactionType.trim() || "Uncategorized"
  });

  if (!exists) {
    toInsert.push(record);   // save only new transactions
  } else {
    duplicates.push(record); // keep track of duplicates
  }
}

// Insert only new transactions
if (toInsert.length > 0) {
  await Transaction.insertMany(toInsert);
}

// Send proper response
res.status(200).json({
  message: duplicates.length > 0
    ? `Some transactions already exist and were skipped`
    : `All transactions uploaded successfully`,
  totalSaved: toInsert.length,
  duplicates: duplicates.length
});

    // Insert all valid transactions into DB
    await Transaction.insertMany(formattedRecords);

    res.status(200).json({
      message: "Excel uploaded and saved successfully!",
      totalSaved: formattedRecords.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
