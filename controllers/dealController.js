
// const Deal = require("../models/Deal");

// // Get all deals
// exports.getDeals = async (req, res) => {
//   try {
//     const deals = await Deal.find().sort({ createdAt: -1 });
//     res.json(deals);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch deals", error: err });
//   }
// };

// // Create a new deal
// exports.createDeal = async (req, res) => {
//   const { ref, date, broker, client, products, status } = req.body;

//   if (!ref || !broker || !client || !products || products.length === 0) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     const newDeal = new Deal({ ref, date, broker, client, products, status });
//     await newDeal.save();
//     res.status(201).json(newDeal);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to create deal", error: err });
//   }
// };

// // Update deal status
// exports.updateDealStatus = async (req, res) => {
//   const { status } = req.body;

//   if (!status) return res.status(400).json({ message: "Status is required" });

//   try {
//     const updatedDeal = await Deal.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );
//     res.json(updatedDeal);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to update deal", error: err });
//   }
// };

// // updated deal edit
// exports.updateDeal = async (req, res) => {
//   const { broker, client, products, status } = req.body;

//   if (!broker || !client || !products || products.length === 0 || !status) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     const updatedDeal = await Deal.findByIdAndUpdate(
//       req.params.id,
//       { broker, client, products, status },
//       { new: true }
//     );
//     res.json(updatedDeal);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to update deal", error: err });
//   }
// };



// // Delete a deal
// exports.deleteDeal = async (req, res) => {
//   try {
//     const deletedDeal = await Deal.findByIdAndDelete(req.params.id);
//     if (!deletedDeal) {
//       return res.status(404).json({ message: "Deal not found" });
//     }
//     res.json({ message: "Deal deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to delete deal", error: err });
//   }
// };
const Deal = require("../models/Deal");
const mongoose = require("mongoose");

// Get all deals
exports.getDeals = async (req, res) => {
  try {
    const deals = await Deal.find().sort({ createdAt: -1 });
    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch deals", error: err });
  }
};

// Create a new deal
exports.createDeal = async (req, res) => {
  let { ref, date, broker, client, products, status } = req.body;

  // Validate required fields
  if (!ref || !broker || !client || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "Ref, broker, client, and products are required" });
  }

  try {
    const newDeal = new Deal({
      ref,
      date: date || new Date(),
      broker,
      client,
      products,
      status: status || "pending",
    });

    await newDeal.save();
    res.status(201).json(newDeal);
  } catch (err) {
    res.status(500).json({ message: "Failed to create deal", error: err });
  }
};

// Update deal status only
exports.updateDealStatus = async (req, res) => {
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: "Status is required" });

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid deal ID" });
  }

  try {
    const updatedDeal = await Deal.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedDeal) return res.status(404).json({ message: "Deal not found" });

    res.json(updatedDeal);
  } catch (err) {
    res.status(500).json({ message: "Failed to update deal status", error: err });
  }
};

// Update deal (full or partial)
exports.updateDeal = async (req, res) => {
  const { broker, client, products, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid deal ID" });
  }

  // Only include fields that are provided
  const updateData = {};
  if (broker) updateData.broker = broker;
  if (client) updateData.client = client;
  if (products) {
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products must be a non-empty array" });
    }
    updateData.products = products;
  }
  if (status) updateData.status = status;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "At least one field is required to update" });
  }

  try {
    const updatedDeal = await Deal.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedDeal) return res.status(404).json({ message: "Deal not found" });

    res.json(updatedDeal);
  } catch (err) {
    res.status(500).json({ message: "Failed to update deal", error: err });
  }
};

// Delete a deal
exports.deleteDeal = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid deal ID" });
  }

  try {
    const deletedDeal = await Deal.findByIdAndDelete(req.params.id);
    if (!deletedDeal) {
      return res.status(404).json({ message: "Deal not found" });
    }
    res.json({ message: "Deal deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete deal", error: err });
  }
};