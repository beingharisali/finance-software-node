
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
router.patch("/certification/:id/status", productController.updateCertificationStatus);

router.patch("/certification/:id/allocate", productController.allocateCertification);
// New PATCH route
router.patch("/:id/allocate", allocateBroker);
// status
router.patch("/:id/status", productController.updateStatus);

module.exports = router;
// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");

// const {
//   importProduct,
//   importCertification,
//   getProducts,
//   getCertifications,
//   allocateBroker,
//   updateStatus,
// } = require("../controllers/productController");


// router.use(express.static(path.resolve(__dirname, "public")));

// // Multer setup
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // ================= ROUTES =================

// // Import Product
// router.post(
//   "/importProduct",
//   upload.single("file"),
//   importProduct
// );

// // Import Certification
// router.post(
//   "/importCertification",
//   upload.single("file"),
//   importCertification
// );

// // Get all products
// router.get("/all", getProducts);

// // Get all certifications
// router.get("/allCertifications", getCertifications);

// // Allocate broker
// router.patch("/:id/allocate", allocateBroker);

// // Update status
// router.patch("/:id/status", updateStatus);

// module.exports = router;