const Product = require("../models/Product");
const XLSX = require("xlsx");
const path = require("path");

const getValue = (row, keys) => {
  for (let key of keys) {
    if (row[key] !== undefined && row[key] !== null) {
      return row[key]; 
    }
  }
  return null;
};

const parseExcelDate = (value) => {
  if (value == null) return null;

  // Excel numeric date
  if (typeof value === "number") {
    const d = XLSX.SSF.parse_date_code(value);
    if (!d) return null;
    return new Date(d.y, d.m - 1, d.d);
  }

  // String date like 11/10/2024
  if (typeof value === "string") {
    const parts = value.split("/");

    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const year = parseInt(parts[2]);

      return new Date(year, month, day);
    }
  }

  return null;
};
// Import products from Excel
const importProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, msg: "No file uploaded" });
    }

    //  Read Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet); 

    if (!rows.length) {
      return res
        .status(400)
        .json({ success: false, msg: "Excel file is empty" });
    }
    
    const productData = rows
      .map((row) => {
 
        const rawProductValue = getValue(row, ["Product AYS", "Product AYS"]);
console.log("Raw Product Value:", rawProductValue, "Parsed:", parseExcelDate(rawProductValue));
        return {
          productId: getValue(row, ["ID", "Id", "id"]),
          liquidMake: getValue(row, ["Liquid/Make", "LIQUID / MAKE"]),
        
        product: parseExcelDate(rawProductValue),
      
          caskNo: getValue(row, ["C ASK No", "C ASK NO"]),
          vessel: getValue(row, ["Vessel", "VESSEL"]),
          lAlc: parseFloat(getValue(row, ["L/ALC", "L/Alc"])) || 0,
          volPercent: parseFloat(getValue(row, ["%VOL", "%Vol"])) || 0,
          costPrice:
            parseFloat(getValue(row, ["CostPRICE", "Cost Price"])) || 0,
          supplierPrice:
            parseFloat(getValue(row, ["Supplier price", "Supplier price"])) || 0,
          finalPrice:
            parseFloat(getValue(row, ["FInal PRICE", "FInal PRICE"])) || 0,
        };
      })
      .filter((p) => p.productId);

    // Remove duplicates based on productId
    const existing = await Product.find({
      productId: { $in: productData.map((p) => p.productId) },
    }).select("productId");

    const existingSet = new Set(existing.map((e) => e.productId));
    const filteredData = productData.filter(
      (p) => !existingSet.has(p.productId),
    );

    //Insert new products
    if (filteredData.length) {
      await Product.insertMany(filteredData);
    }

    res.status(200).json({
      success: true,
      msg: `Excel imported successfully. ${filteredData.length} new products added.`,
    });
  } catch (error) {
    console.error("Excel import error:", error);
    res.status(400).json({ success: false, msg: error.message });
  }
};

// Fetch all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find(); 
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = {
  importProduct,
  getProducts,
};
