
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

//     const rows = XLSX.utils.sheet_to_json(sheet, {
//       defval: "",
//       raw: false,
//       dateNF: "DD/MM/YYYY",
//     });

//     if (!rows.length) {
//       return res
//         .status(400)
//         .json({ message: "No data found in the uploaded file." });
//     }

//     // Column Mapping
//     const columnMap = {
//       transactionId: ["Transaction ID", "TxnId", "Reference", "Ref No", "ID"],
//       transactionDate: ["Transaction Date", "Date", "TransDate"],
//       transactionDescription: [
//         "Description",
//         "Name",
//         "Notes and #tags",
//         "Transaction Description",
//         "Transaction description",
//         "Desc",
//       ],
//       transactionType: [
//         "Type",
//         "Category",
//         "Category split",
//         "Transaction Type",
//         "Transaction type",
//       ],
//       debitAmount: ["Money out", "Debit Amount", "Dr"],
//       creditAmount: ["Money In", "Credit Amount", "Cr"],
//       amount: ["Amount", "Local amount",  "Paid in"],
//       currency: ["currency", "Local currency"],
//       sortCode: ["Sort Code", "Sort"],
//       accountNumber: ["Account Number", "AccNo"],
//       balance: ["Balance", "Bal"],
//       category: ["Category","Category name"],
//       time: ["Time"], // optional if CSV has Time column
//     };

//     const formattedRecords = [];

//     rows.forEach((r) => {
//       const record = {};

//       // Duplicate check based on transactionId
//       record.transactionId = getValue(r, columnMap.transactionId);
//       if (!record.transactionId) return; // skip if no ID

//       // --------------- Date Handling ---------------
//       const rawDate = getValue(r, columnMap.transactionDate);
//       const rawTime = getValue(r, columnMap.time) || "00:00:00";

//       if (rawDate) {
//         if (typeof rawDate === "number") {
//           // Excel number date
//           const d = XLSX.SSF.parse_date_code(rawDate);
//           if (d) {
//             const isoDate = `${d.y}-${String(d.m).padStart(2, "0")}-${String(d.d).padStart(2, "0")}T${rawTime}Z`;
//             record.transactionDate = new Date(isoDate);
//           } else {
//             record.transactionDate = new Date();
//           }
//         } else {
//           // String date
//           const cleanDate = String(rawDate).trim();
//           const m = moment(cleanDate, ["D/M/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]);
//           if (m.isValid()) {
//             const dateString = m.format("YYYY-MM-DD");
//             record.transactionDate = new Date(`${dateString}T${rawTime}Z`);
//           } else {
//             // fallback
//             record.transactionDate = new Date(cleanDate);
//           }
//         }
//       } else {
//         record.transactionDate = new Date(); // fallback if no date
//       }


      
//       // --------------- Amounts ---------------

// // //Paid In / Paid Out support
// // const paidIn = Number(getValue(r, ["Paid in", "Paid In"])) || 0;
// // const paidOut = Number(getValue(r, ["Paid out", "Paid Out"])) || 0;

// // // existing fields
// // const debit = Number(getValue(r, columnMap.debitAmount)) || 0;
// // const credit = Number(getValue(r, columnMap.creditAmount)) || 0;
// // const amountField = Number(getValue(r, columnMap.amount)) || 0;


// // if (paidIn || paidOut) {
 
// //   record.amount = paidIn - paidOut;
// // } else if (credit || debit) {

// //   record.amount = credit - debit;
// // } else {

// //   record.amount = amountField;
// // }
// // --------------- Amounts ---------------

//     // --------------- Amounts (Updated Logic) ---------------

// // 1. Raw value uthayein (Sirf Paid In par focus)
// const rawPaidIn = getValue(r, ["Paid in", "Paid In", "Money In", "Credit Amount"]);

// // 2. Logic to handle Text, Number, or Empty
// if (rawPaidIn !== null && rawPaidIn !== undefined && rawPaidIn !== "") {
//     // Agar value number hai ya aisi string jo number lag rahi (e.g. "100" or 100)
//     const cleaned = String(rawPaidIn).replace(/[^\d.-]/g, "");
//     const num = parseFloat(cleaned);

//     if (!isNaN(num) && cleaned !== "") {
//         // Agar valid number hai toh wahi set karein
//         record.amount = num;
//     } else {
//         // Agar text hai (e.g. "Pending", "Refused") toh usay description mein merge karein ya direct wahi text dikhayein
//         // Note: Agar aapka Database 'amount' field 'Number' type hai, toh wahan text save nahi hoga.
//         // Phir aapko record.amount = 0 rakhna hoga aur description update karni hogi.
//         record.amount = 0; 
//         record.transactionDescription = `${record.transactionDescription} (Status: ${rawPaidIn})`;
//     }
// } else {
//     // Agar khali (empty/null) hai toh zero
//     record.amount = 0;
// }


//       // --------------- Other Fields ---------------
//       record.transactionDescription =
//         getValue(r, columnMap.transactionDescription) || "No description";
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
//         message:
//           "No valid transactions found (Transaction ID missing in file).",
//       });
//     }

//     // ---------------- Duplication Check ----------------
//     const transactionIds = formattedRecords.map((r) => r.transactionId);
//     const existingTransactions = await Transaction.find({
//       transactionId: { $in: transactionIds },
//     }).select("transactionId");

//     const existingIdSet = new Set(
//       existingTransactions.map((t) => t.transactionId),
//     );

//     const toInsert = [];
//     const duplicates = [];

//     formattedRecords.forEach((record) => {
//       if (!existingIdSet.has(record.transactionId)) {
//         toInsert.push(record);
//       } else {
//         duplicates.push(record);
//       }
//     });

//     // ---------------- Insert ----------------
//     if (toInsert.length > 0) {
//       await Transaction.insertMany(toInsert, { ordered: false });
//     }

//     return res.status(200).json({
//       message:
//         duplicates.length > 0
//           ? "Some transactions already exist and were skipped"
//           : "All transactions uploaded successfully",
//       totalSaved: toInsert.length,
//       duplicates: duplicates.length,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };
// error resolved

const Transaction = require("../models/Transaction");
const XLSX = require("xlsx");
const moment = require("moment");

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

    const rows = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
      raw: false,
      dateNF: "DD/MM/YYYY",
    });

    if (!rows.length) {
      return res
        .status(400)
        .json({ message: "No data found in the uploaded file." });
    }

    // Column Mapping
    const columnMap = {
      transactionId: ["Transaction ID", "TxnId", "Reference", "Ref No", "ID"],
      transactionDate: ["Transaction Date", "Date", "TransDate"],
      transactionDescription: [
        "Description",
        "Name",
        "Notes and #tags",
        "Transaction Description",
        "Transaction description",
        "Desc",
      ],
      transactionType: [
        "Type",
        "Category",
        "Category split",
        "Transaction Type",
        "Transaction type",
      ],
      debitAmount: ["Money out", "Debit Amount", "Dr"],
      creditAmount: ["Money In", "Credit Amount", "Cr"],
      amount: ["Amount", "Local amount",  "Paid in"],
      currency: ["currency", "Local currency"],
      sortCode: ["Sort Code", "Sort"],
      accountNumber: ["Account Number", "AccNo"],
      balance: ["Balance", "Bal"],
      category: ["Category","Category name"],
      time: ["Time"], // optional if CSV has Time column
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
          const m = moment(cleanDate, ["D/M/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]);
          if (m.isValid()) {
            const dateString = m.format("YYYY-MM-DD");
            record.transactionDate = new Date(`${dateString}T${rawTime}Z`);
          } else {
            // fallback
            record.transactionDate = new Date(cleanDate);
          }
        }
      } else {
        record.transactionDate = new Date(); // fallback if no date
      }


      
      // --------------- Amounts ---------------

// //Paid In / Paid Out support
// const paidIn = Number(getValue(r, ["Paid in", "Paid In"])) || 0;
// const paidOut = Number(getValue(r, ["Paid out", "Paid Out"])) || 0;

// // existing fields
// const debit = Number(getValue(r, columnMap.debitAmount)) || 0;
// const credit = Number(getValue(r, columnMap.creditAmount)) || 0;
// const amountField = Number(getValue(r, columnMap.amount)) || 0;


// if (paidIn || paidOut) {
 
//   record.amount = paidIn - paidOut;
// } else if (credit || debit) {

//   record.amount = credit - debit;
// } else {

//   record.amount = amountField;
// }
// --------------- Amounts ---------------

      // 1. Raw values uthayein (unprocessed)
      const rawPaidIn = getValue(r, ["Paid in", "Paid In"]);
      const rawPaidOut = getValue(r, ["Paid out", "Paid Out"]);
      const rawDebit = getValue(r, columnMap.debitAmount);
      const rawCredit = getValue(r, columnMap.creditAmount);
      const rawAmount = getValue(r, columnMap.amount);

      // Helper function: Text ko saaf karke number mein badle (e.g. "£1,200.50" -> 1200.50)
      const parseNum = (val) => {
        if (val === null || val === undefined || val === "") return 0;
        // Agar value string hai toh currency symbols aur commas hata kar number banayein
        const cleaned = String(val).replace(/[^\d.-]/g, "");
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
      };

      const pIn = parseNum(rawPaidIn);
      const pOut = parseNum(rawPaidOut);
      const cr = parseNum(rawCredit);
      const dr = parseNum(rawDebit);
      const amt = parseNum(rawAmount);

      // Logic: Priority ke mutabiq amount calculate karein
      if (rawPaidIn || rawPaidOut) {
        record.amount = pIn - pOut;
      } else if (rawCredit || rawDebit) {
        record.amount = cr - dr;
      } else if (rawAmount) {
        record.amount = amt;
      } else {
        // Agar amount ke columns khali hain par description hai, toh 0 set karein
        record.amount = 0;
      }


      // --------------- Other Fields ---------------
      record.transactionDescription =
        getValue(r, columnMap.transactionDescription) || "No description";
      record.transactionType =
        getValue(r, columnMap.transactionType) || "Uncategorised";
      record.sortCode = getValue(r, columnMap.sortCode) || "";
      record.accountNumber = getValue(r, columnMap.accountNumber) || "";
      record.balance = Number(getValue(r, columnMap.balance)) || 0;
      record.currency = getValue(r, columnMap.currency) || "";
      record.category = getValue(r, columnMap.category) || "";

      formattedRecords.push(record);
    });

    if (!formattedRecords.length) {
      return res.status(400).json({
        message:
          "No valid transactions found (Transaction ID missing in file).",
      });
    }

    // ---------------- Duplication Check ----------------
    const transactionIds = formattedRecords.map((r) => r.transactionId);
    const existingTransactions = await Transaction.find({
      transactionId: { $in: transactionIds },
    }).select("transactionId");

    const existingIdSet = new Set(
      existingTransactions.map((t) => t.transactionId),
    );

    const toInsert = [];
    const duplicates = [];

    formattedRecords.forEach((record) => {
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
      message:
        duplicates.length > 0
          ? "Some transactions already exist and were skipped"
          : "All transactions uploaded successfully",
      totalSaved: toInsert.length,
      duplicates: duplicates.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
