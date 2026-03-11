
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const productController = require("../controllers/productController");

router.use(express.static(path.resolve(__dirname, "public")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/uploads"),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const uploads = multer({ storage: storage });

router.post(
  "/importProduct",
  uploads.single("file"),
  productController.importProduct
);

router.get("/all", productController.getProducts);

module.exports = router;