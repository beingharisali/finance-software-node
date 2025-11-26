// const express = require("express");
// const router = express.Router();
// const {
//   getCategories, addCategory, deleteCategory ,
// } = require("../controllers/Category");

// router.get("/", getCategories);

// // Add new category
// router.post("/add", addCategory);

// // Delete category
// router.delete("/delete", deleteCategory);

// module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");
const allowRoles = require("../middleware/roleMiddleware");
const { getCategories, addCategory, deleteCategory } = require("../controllers/Category");

// Get Categories → All roles
router.get("/", auth, allowRoles("admin", "manager", "assistant", "broker"), getCategories);

// Add/Delete Category → Admin + Manager only
router.post("/add", auth, allowRoles("admin", "manager"), addCategory);
router.delete("/delete", auth, allowRoles("admin", "manager"), deleteCategory);

module.exports = router;
