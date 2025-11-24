
const Transaction = require("../models/Transaction");
const XLSX = require("xlsx");
const moment = require("moment");

exports.uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Parse Excel file buffer
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    // Map Excel rows to Transaction schema
    const formattedRecords = rows.map((r, index) => {
      // Parse Date (support DD/MM/YYYY format)
      const parsedDate = moment(r["Transaction Date"], "DD/MM/YYYY", true);
      if (!parsedDate.isValid()) {
        throw new Error(
          `Invalid date format in row ${index + 1}: ${r["Transaction Date"]}`
        );
      }

      // Determine Amount (Debit or Credit)
      let amount = 0;
      if (r["Debit Amount"] && r["Debit Amount"].toString().trim() !== "") {
        amount = -Math.abs(Number(r["Debit Amount"])); // Debit = negative
      } else if (
        r["Credit Amount"] &&
        r["Credit Amount"].toString().trim() !== ""
      ) {
        amount = Math.abs(Number(r["Credit Amount"])); // Credit = positive
      }

      return {
        date: parsedDate.toDate(),
        description: r["Transaction Description"] || "",
        category: r["Transaction Type"] || "Uncategorized",
        amount: amount,
      };
    });

    // Save to DB
    await Transaction.insertMany(formattedRecords);

    res.status(200).json({
      message: "Excel uploaded and saved to DB successfully!",
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
