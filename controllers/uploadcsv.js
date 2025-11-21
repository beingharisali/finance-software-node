
const Transaction = require("../models/Transaction");
const { parse } = require("csv-parse/sync");
const moment = require("moment");

exports.uploadCSV = async (req, res) => {
  try {
    console.log("Received file:", req.file);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const csvContent = req.file.buffer.toString("utf-8");
    console.log("CSV Content:", csvContent);

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    console.log("Parsed CSV records (sample):", records.slice(0, 5));

    const formattedRecords = records.map((r, index) => {
      // DD/MM/YYYY format strict parsing
      const parsedDate = moment(r.Date, "DD/MM/YYYY", true);
      if (!parsedDate.isValid()) {
        throw new Error(`Invalid date format in row ${index + 1}: ${r.Date}`);
      }
      return {
        date: parsedDate.toDate(),
        description: r.Description,
        category: r.Category,
        amount: Number(r.Amount),
      };
    });

    console.log("Formatted records for DB (sample):", formattedRecords.slice(0, 5));

    // Insert into DB
    await Transaction.insertMany(formattedRecords);

    res.status(200).json({
      message: "CSV uploaded and saved to DB successfully!",
      totalSaved: formattedRecords.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
