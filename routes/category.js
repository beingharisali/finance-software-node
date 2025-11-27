// // const express = require("express");
// // const router = express.Router();
// // const {
// //   getCategories, addCategory, deleteCategory ,
// // } = require("../controllers/Category");

// // router.get("/", getCategories);

// // // Add new category
// // router.post("/add", addCategory);

// // // Delete category
// // router.delete("/delete", deleteCategory);

// // module.exports = router;
// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/authentication");
// const allowRoles = require("../middleware/roleMiddleware");
// const { getCategories, addCategory, deleteCategory } = require("../controllers/Category");

// // Get Categories → All roles
// router.get("/", auth, allowRoles("admin"), getCategories);

// // Add/Delete Category → Admin
// router.post("/add", auth, allowRoles("admin"), addCategory);
// router.delete("/delete", auth, allowRoles("admin"), deleteCategory);

// module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");
const allowRoles = require("../middleware/roleMiddleware");
const { 
  getCategories, 
  addCategory, 
  deleteCategory, 
  updateCategory 
} = require("../controllers/Category");

// ---------------------- GET CATEGORIES ----------------------
// All roles can fetch categories
router.get("/", auth, allowRoles("admin"), getCategories);

// ---------------------- ADD CATEGORY ----------------------
// Admin only
router.post("/add", auth, allowRoles("admin"), addCategory);

// ---------------------- DELETE CATEGORY ----------------------
// Admin only
router.delete("/delete", auth, allowRoles("admin"), deleteCategory);

// ---------------------- UPDATE CATEGORY ----------------------
// Admin only
router.put("/update", auth, allowRoles("admin"), updateCategory);

module.exports = router;
