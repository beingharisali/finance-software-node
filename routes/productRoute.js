
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const productController = require("../controllers/productController");
const { allocateBroker } = require("../controllers/productController");
router.use(express.static(path.resolve(__dirname, "public")));

const storage = multer.memoryStorage();

const uploads = multer({ storage });


router.post(
  "/importProduct",
  uploads.single("file"),
  productController.importProduct
);
router.post(
  "/importCertification",
  uploads.single("file"),
  productController.importCertification
);

router.get("/all", productController.getProducts);
router.get("/allCertifications", productController.getCertifications);
// New PATCH route
router.patch("/:id/allocate", allocateBroker);
// status
router.patch("/:id/status", productController.updateStatus);

module.exports = router;