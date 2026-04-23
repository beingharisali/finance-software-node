
const Product = require("../models/Product");
const Certification = require("../models/Certification");
const XLSX = require("xlsx");
// const path = require("path");
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
    // const workbook = XLSX.readFile(req.file.path);
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
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
        const rawBottles = getValue(row, ["Bottles"]);
        const rawProductValue = getValue(row, [
          "Product AYS",
          "product ays",
          "AYS",
        ]);
        console.log(
          "Raw Product Value:",
          rawProductValue,
          "Parsed:",
          parseExcelDate(rawProductValue),
        );
        return {
     
          // old
          productId: getValue(row, ["ID", "Id", "id"]),
          // productId: String(getValue(row, ["ID", "Id", "id"]) || "").trim() || null,
          liquidMake: getValue(row, ["Liquid/Make", "LIQUID / MAKE"]),
          product: parseExcelDate(rawProductValue),
          caskNo: getValue(row, ["C ASK No", "C ASK NO", "CASK NO"]),
          vessel: getValue(row, ["Vessel", "VESSEL"]),
          lAlc: parseFloat(getValue(row, ["L/ALC", "L/Alc"])) || 0,
          volPercent: parseFloat(getValue(row, ["%VOL", "%Vol"])) || 0,
          costPrice:
            parseFloat(
              getValue(row, ["CostPRICE", "Cost Price", "SELL PRICE"]),
            ) || 0,
          location: getValue(row, ["Location", "LOCATION"]),
          bottles: rawBottles
            ? parseFloat(String(rawBottles).match(/\d+/)?.[0]) || 0
            : 0,
          supplierPrice:
            parseFloat(
              getValue(row, ["Supplier price", "Supplier price", "Price"]),
            ) || 0,
          finalPrice:
            parseFloat(
              getValue(row, ["FInal PRICE", "FInal PRICE", "Elliiot"]),
            ) || 0,
        };
      })
      // .filter((p) => p.productId);
      await Product.insertMany(productData);

    const existing = await Product.find({
      $or: productData.map((p) => ({
        productId: p.productId,
        caskNo: p.caskNo,
      })),
    }).select("productId caskNo");

    const existingSet = new Set(
      existing.map((e) => `${e.productId}-${e.caskNo}`),
    );

    const filteredData = productData.filter(
      (p) => !existingSet.has(`${p.productId}-${p.caskNo}`),
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
// status

// Update status
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      // { status },
      { status, statusDate: new Date() },
      { new: true },
    );

    if (!product) return res.status(404).json({ msg: "Product not found" });

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ success: false, msg: "Failed to update status" });
  }
};

// Allocate broker to product
const allocateBroker = async (req, res) => {
  const { id } = req.params; // product id
  const { brokerId } = req.body; // selected broker id

  try {
    // Step 1: find product by id
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    // Step 2: update allocatedBroker
    product.allocatedBroker = brokerId || "";

    product.status = brokerId ? "On Hold" : "Available";

    if (brokerId) {
      product.status = "On Hold";
      product.statusDate = new Date();
    } else {
      product.status = "Available";
      product.statusDate = null;
    }

    // Step 4: save product
    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    console.error("Allocate broker error:", err);
    res.status(500).json({ success: false, msg: "Failed to allocate broker" });
  }
};

// new


// Import certification from Excel/CSV
const importCertification = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, msg: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // defval: null use karein taake undefined error na aaye
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: null });

    if (!rows.length) {
      return res.status(400).json({ success: false, msg: "File is empty" });
    }

    const certificationData = rows.map((row) => {
      const certNo = getValue(row, ["Certificate #", "Cert No", "CERT NO", "certification"]);
      
      const cleanPrice = (val) => {
        if (!val) return 0;
        // Symbol (£, $) aur commas hatane ke liye
        return parseFloat(String(val).replace(/[^\d.]/g, "")) || 0;
      };

      return {
        // Trim karke check karein, agar khali hai toh null rakhein
        certification: certNo && String(certNo).trim() !== "" ? String(certNo).trim() : null, 
        denomination: getValue(row, ["Denomination"]),
        year: parseInt(getValue(row, ["Year"])) || 0,
        reverse: getValue(row, ["Reverse"]),
        grade: getValue(row, ["Grade"]),
        price: cleanPrice(getValue(row, ["Price"])),
        scPrice: cleanPrice(getValue(row, ["SC Price"])),
      };
    });

    // --- FIX: Filter out null or empty certifications ---
    // Kyunki database unique index empty/null ko duplicate manta hai
    const validData = certificationData.filter((c) => c.certification !== null);

    if (!validData.length) {
      return res.status(200).json({ success: true, msg: "No valid rows with Certificate numbers found." });
    }

    // Duplicate check logic
    const certsInFile = validData.map(d => d.certification);
    const existing = await Certification.find({
      certification: { $in: certsInFile },
    }).select("certification");

    const existingSet = new Set(existing.map((e) => e.certification));

    // Sirf wo data lein jo DB mein nahi hai
    const filteredData = validData.filter(
      (c) => !existingSet.has(c.certification)
    );

    if (filteredData.length > 0) {
      await Certification.insertMany(filteredData);
    }

    res.status(200).json({
      success: true,
      msg: `${filteredData.length} new certifications added successfully.`,
    });
  } catch (error) {
    console.error("Certification import error:", error);
    // Duplicate error ko handle karein gracefully
    if (error.code === 11000) {
        return res.status(400).json({ success: false, msg: "Duplicate certification number found in file or database." });
    }
    res.status(500).json({ success: false, msg: error.message });
  }
};


module.exports = {
  importProduct,
  getProducts,
  allocateBroker,
  updateStatus,
  importCertification, 
};

