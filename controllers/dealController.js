

const Deal = require("../models/Deal");
const mongoose = require("mongoose");
const Product = require("../models/Product");

//  Get all deals
exports.getDeals = async (req, res) => {
  try {
    const deals = await Deal.find().sort({ createdAt: -1 });
    res.json(deals);
  } catch (err) {
    console.error("Get Deals Error:", err);
    res.status(500).json({ message: "Failed to fetch deals", error: err.message });
  }
};

//  Create a new deal
exports.createDeal = async (req, res) => {
  const { broker, client, products, status, commission } = req.body;

  if (!broker || !client || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "Broker, client, and at least one product are required" });
  }

  try {
    // 🔹 FIXED: generate unique sequential ref
    const lastDeal = await Deal.findOne().sort({ ref: -1 });
    const newRef = lastDeal ? String(Number(lastDeal.ref) + 1).padStart(3, "0") : "001";

    const newDeal = new Deal({
      ref: newRef,
      
      date: new Date(),
      broker,
      client,
      products,
      status: status || "document sent",
      commission: commission || 0,
    });

    // const savedDeal = await newDeal.save();
    // res.status(201).json(savedDeal);
    const savedDeal = await newDeal.save();


const productIds = products.map(p => p.productId);

await Product.updateMany(
  { _id: { $in: productIds } },
  { 
    $set: { 
      status: "On Hold",
      statusDate: new Date()
    } 
  }
);

res.status(201).json(savedDeal);
  } catch (err) {
    console.error("Create Deal Error:", err);
    res.status(500).json({ message: "Failed to create deal", error: err.message });
  }
};

// Update deal (FULL + STATUS SUPPORT)
exports.updateDeal = async (req, res) => {
  // const { broker, client, products, status } = req.body;
  const { broker, client, products, status, commission } = req.body;

  // ID validation
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid deal ID" });
  }

  const updateData = {};

  // Only update provided fields
  if (broker) updateData.broker = broker;
  if (client) updateData.client = client;

  if (products !== undefined) {
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Products must be a non-empty array",
      });
    }
    updateData.products = products;
  }

  if (status) updateData.status = status;
  if (commission !== undefined) {
    updateData.commission = commission;
  }

  try {
    const updatedDeal = await Deal.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedDeal) {
      return res.status(404).json({ message: "Deal not found" });
    }
// 🔥 ADD THIS BLOCK
// 🔥 HANDLE PRODUCT STATUS BASED ON DEAL STATUS
if (status || products) {

  // get product ids (new ya existing deal se)
  const productIds = products
    ? products.map(p => p.productId)
    : updatedDeal.products.map(p => p.productId);

  let productStatus = "On Hold";

  if (status === "Completed") {
    productStatus = "Sold";
  }

  await Product.updateMany(
    { _id: { $in: productIds } },
    {
      $set: {
        status: productStatus,
        statusDate: new Date()
      }
    }
  );
}
// if (products) {
//   const productIds = products.map(p => p.productId);

//   await Product.updateMany(
//     { _id: { $in: productIds } },
//     { 
//       $set: { 
//         status: "On Hold",
//         statusDate: new Date()
//       } 
//     }
//   );
// }
    res.json(updatedDeal);

  } catch (err) {
    console.error("Update Deal Error:", err);
    res.status(500).json({ message: "Failed to update deal", error: err.message });
  }
};

//  Delete deal base on state

exports.deleteDeal = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid deal ID" });
  }

  try {

    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    const productIds = deal.products.map(p => p.productId);

    await Product.updateMany(
      { _id: { $in: productIds } },
      {
        $set: {
          status: "Available",
          statusDate: null
        }
      }
    );

    await Deal.findByIdAndDelete(req.params.id);

    res.json({ message: "Deal deleted & products updated successfully" });

  } catch (err) {
    console.error("Delete Deal Error:", err);
    res.status(500).json({ message: "Failed to delete deal", error: err.message });
  }
};
// exports.deleteDeal = async (req, res) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     return res.status(400).json({ message: "Invalid deal ID" });
//   }

//   try {
//     const deletedDeal = await Deal.findByIdAndDelete(req.params.id);

//     if (!deletedDeal) {
//       return res.status(404).json({ message: "Deal not found" });
//     }

//     res.json({ message: "Deal deleted successfully" });

//   } catch (err) {
//     console.error("Delete Deal Error:", err);
//     res.status(500).json({ message: "Failed to delete deal", error: err.message });
//   }
// };