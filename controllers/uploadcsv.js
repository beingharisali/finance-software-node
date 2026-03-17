
// const Transaction = require("../models/Transaction");
// const XLSX = require("xlsx");
// const moment = require("moment");

// const getValue = (row, keys) => {
//   for (let k of keys) {
//     if (row[k] !== undefined && row[k] !== null && row[k] !== "") return row[k];
//   }
//   return null;
// };

// exports.uploadCSV = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     // const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
//     const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: true });

//     if (!rows.length) {
//       return res.status(400).json({ message: "No data found in the uploaded file." });
//     }
//     // Column Mapping
//     const columnMap = {
//       transactionId: ["Transaction ID", "TxnId", "Reference", "Ref No", "ID"],
//       transactionDate: ["Transaction Date", "Date", "TransDate"],
//       transactionDescription: ["Description", "Name", "Notes and #tags", "Transaction Description", "Desc"],
//       transactionType: ["Type", "Category", "Category split", "Transaction Type"],
//       debitAmount: ["Money out", "Debit Amount", "Dr"],
//       creditAmount: ["Money In", "Credit Amount", "Cr"],
//       amount: ["Amount", "Local amount"],
//       currency: ["currency", "Local currency"],
//       sortCode: ["Sort Code", "Sort"],
//       accountNumber: ["Account Number", "AccNo"],
//       balance: ["Balance", "Bal"],
//       category: ["Category"]
//     };

//     const formattedRecords = [];
//     rows.forEach((r) => {
//       const record = {};
//       // duplicate check base on transaction id.  skip if no ID
//       record.transactionId = getValue(r, columnMap.transactionId);
//       if (!record.transactionId) return; 
//       //  Date Handling
//       let dateField = getValue(r, columnMap.transactionDate);
//       if (typeof dateField === "number") {
//         const d = XLSX.SSF.parse_date_code(dateField);
//         record.transactionDate = d ? new Date(d.y, d.m - 1, d.d) : new Date();
//       } else if (dateField) {
//         const m = moment(dateField, ["D/M/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]);
//         record.transactionDate = m.isValid() ? m.toDate() : new Date();
//       } else {
//         record.transactionDate = new Date();
//       }
// //       let rawDate = getValue(r, columnMap.transactionDate);

// // if (rawDate) {
// //   if (typeof rawDate === "number") {
// //     const d = XLSX.SSF.parse_date_code(rawDate);
// //     record.transactionDate = d 
// //       ? new Date(d.y, d.m - 1, d.d) 
// //       : new Date();
// //   } else {
// //     const cleanDate = String(rawDate).trim();
// //     const parts = cleanDate.split('/');
    
// //     if (parts.length === 3) {
// //       const day = parts[0].trim().padStart(2, '0');
// //       const month = parts[1].trim().padStart(2, '0');
// //       const year = parts[2].trim();
      
// //       record.transactionDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
// //     } else {
// //       record.transactionDate = new Date(cleanDate);
// //     }
// //   }
// // }

//       const debit = Number(getValue(r, columnMap.debitAmount)) || 0;
//       const credit = Number(getValue(r, columnMap.creditAmount)) || 0;
//       const amountField = Number(getValue(r, columnMap.amount)) || 0;
//       record.amount = credit - debit || amountField;
// record.transactionDescription =
//    getValue(r, columnMap.transactionDescription) || "No description";
//       record.transactionType =
//         getValue(r, columnMap.transactionType) || "Uncategorised";
//       record.sortCode = getValue(r, columnMap.sortCode) || "";
//       record.accountNumber = getValue(r, columnMap.accountNumber) || "";
//       record.balance = Number(getValue(r, columnMap.balance)) || 0;
//       record.currency = getValue(r, columnMap.currency) || "";
//       record.category = getValue(r, columnMap.category) || "";

//       formattedRecords.push(record);
//     });
//     if (!formattedRecords.length) {
//       return res.status(400).json({
//         message: "No valid transactions found (Transaction ID missing in file)."
//       });
//     }

//     // Dubplication check using transactionId
//     const transactionIds = formattedRecords.map(r => r.transactionId);

//     const existingTransactions = await Transaction.find({
//       transactionId: { $in: transactionIds }
//     }).select("transactionId");

//     const existingIdSet = new Set(
//       existingTransactions.map(t => t.transactionId)
//     );

//     const toInsert = [];
//     const duplicates = [];

//     formattedRecords.forEach(record => {
//       if (!existingIdSet.has(record.transactionId)) {
//         toInsert.push(record);
//       } else {
//         duplicates.push(record);
//       }
//     });

//     if (toInsert.length > 0) {
//       await Transaction.insertMany(toInsert);
//     }

//     return res.status(200).json({
//       message:
//         duplicates.length > 0
//           ? "Some transactions already exist and were skipped"
//           : "All transactions uploaded successfully",
//       totalSaved: toInsert.length,
//       duplicates: duplicates.length
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Server error",
//       error: error.message
//     });
//   }
// };
const Transaction = require("../models/Transaction");
const XLSX = require("xlsx");

const getValue = (row, keys) => {
  for (let k of keys) {
    if (row[k] !== undefined && row[k] !== null && row[k] !== "") return row[k];
  }
  return null;
};

exports.uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // ✅ raw:true ensures Excel numbers (dates) are not auto converted
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: true });

    if (!rows.length) {
      return res.status(400).json({ message: "No data found in the uploaded file." });
    }

    // Column Mapping
    const columnMap = {
      transactionId: ["Transaction ID", "TxnId", "Reference", "Ref No", "ID"],
      transactionDate: ["Transaction Date", "Date", "TransDate"],
      transactionDescription: ["Description", "Name", "Notes and #tags", "Transaction Description", "Desc"],
      transactionType: ["Type", "Category", "Category split", "Transaction Type"],
      debitAmount: ["Money out", "Debit Amount", "Dr"],
      creditAmount: ["Money In", "Credit Amount", "Cr"],
      amount: ["Amount", "Local amount"],
      currency: ["currency", "Local currency"],
      sortCode: ["Sort Code", "Sort"],
      accountNumber: ["Account Number", "AccNo"],
      balance: ["Balance", "Bal"],
      category: ["Category"],
      time: ["Time"] // optional if CSV has Time column
    };

    const formattedRecords = [];

    rows.forEach((r) => {
      const record = {};

      // Duplicate check based on transactionId
      record.transactionId = getValue(r, columnMap.transactionId);
      if (!record.transactionId) return; // skip if no ID

      // --------------- Date Handling ---------------
      const rawDate = getValue(r, columnMap.transactionDate);
      const rawTime = getValue(r, columnMap.time) || "00:00:00";

      if (rawDate) {
        if (typeof rawDate === "number") {
          // Excel number date
          const d = XLSX.SSF.parse_date_code(rawDate);
          if (d) {
            const isoDate = `${d.y}-${String(d.m).padStart(2, "0")}-${String(d.d).padStart(2, "0")}T${rawTime}Z`;
            record.transactionDate = new Date(isoDate);
          } else {
            record.transactionDate = new Date();
          }
        } else {
          // String date
          const cleanDate = String(rawDate).trim();
          const parts = cleanDate.split("/");
          if (parts.length === 3) {
            const day = parts[0].trim().padStart(2, "0");
            const month = parts[1].trim().padStart(2, "0");
            const year = parts[2].trim();
            const isoDateString = `${year}-${month}-${day}T${rawTime}Z`;
            record.transactionDate = new Date(isoDateString);
          } else {
            // fallback
            record.transactionDate = new Date(cleanDate);
          }
        }
      } else {
        record.transactionDate = new Date(); // fallback if no date
      }

      // --------------- Amounts ---------------
      const debit = Number(getValue(r, columnMap.debitAmount)) || 0;
      const credit = Number(getValue(r, columnMap.creditAmount)) || 0;
      const amountField = Number(getValue(r, columnMap.amount)) || 0;
      record.amount = credit - debit || amountField;

      // --------------- Other Fields ---------------
      record.transactionDescription = getValue(r, columnMap.transactionDescription) || "No description";
      record.transactionType = getValue(r, columnMap.transactionType) || "Uncategorised";
      record.sortCode = getValue(r, columnMap.sortCode) || "";
      record.accountNumber = getValue(r, columnMap.accountNumber) || "";
      record.balance = Number(getValue(r, columnMap.balance)) || 0;
      record.currency = getValue(r, columnMap.currency) || "";
      record.category = getValue(r, columnMap.category) || "";

      formattedRecords.push(record);
    });

    if (!formattedRecords.length) {
      return res.status(400).json({
        message: "No valid transactions found (Transaction ID missing in file)."
      });
    }

    // ---------------- Duplication Check ----------------
    const transactionIds = formattedRecords.map(r => r.transactionId);
    const existingTransactions = await Transaction.find({
      transactionId: { $in: transactionIds }
    }).select("transactionId");

    const existingIdSet = new Set(existingTransactions.map(t => t.transactionId));

    const toInsert = [];
    const duplicates = [];

    formattedRecords.forEach(record => {
      if (!existingIdSet.has(record.transactionId)) {
        toInsert.push(record);
      } else {
        duplicates.push(record);
      }
    });

    // ---------------- Insert ----------------
    if (toInsert.length > 0) {
      await Transaction.insertMany(toInsert, { ordered: false });
    }

    return res.status(200).json({
      message: duplicates.length > 0
        ? "Some transactions already exist and were skipped"
        : "All transactions uploaded successfully",
      totalSaved: toInsert.length,
      duplicates: duplicates.length
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};