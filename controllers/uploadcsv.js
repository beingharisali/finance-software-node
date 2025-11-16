const Transaction = require("../models/Transaction");
//ye CSV ko JavaScript objects mein convert karta h
const { parse } = require("csv-parse/sync");

exports.uploadCSV = async (req, res) => {
  try {
     console.log("Received file:", req.file);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
// file ko buffer se readable text bnane ke laiye kiya ha 
    const csvContent = req.file.buffer.toString("utf-8");
       console.log("CSV Content:", csvContent);

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

const formattedRecords = records.map((r) => ({
  date: r.Date,           
  description: r.Description,
  category: r.Category,
  amount: Number(r.Amount) 
}));

    console.log(formattedRecords.slice(0, 5));
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
