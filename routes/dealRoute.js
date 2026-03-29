
// const express = require("express");
// const router = express.Router();
// const dealController = require("../controllers/dealController");

// //  Get all deals
// router.get("/", dealController.getDeals);

// //  Create new deal
// router.post("/", dealController.createDeal);

// //  Full update (edit form + status)
// router.put("/:id", dealController.updateDeal);

// //  Delete deal
// router.delete("/:id", dealController.deleteDeal);

// module.exports = router;
const express = require("express");
const router = express.Router();
const dealController = require("../controllers/dealController");

// 🔹 Get all deals
router.get("/", dealController.getDeals);

// 🔹 Create new deal
router.post("/", dealController.createDeal);

// 🔹 Update a deal (full update or status update)
router.put("/:id", dealController.updateDeal);

// 🔹 Delete a deal
router.delete("/:id", dealController.deleteDeal);

// 🔹 Optional: Get all deals for a specific client by client _id
router.get("/client/:clientId", async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const deals = await dealController.getDealsByClient(clientId); // We will add this function in controller
    res.json(deals);
  } catch (err) {
    console.error("Get Client Deals Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;