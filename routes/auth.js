// // const express = require("express");
// // const router = express.Router();
// // const authenticateUser = require("../middleware/authentication");

// // const { register, login, getProfile } = require("../controllers/auth");

// // router.post("/register", authenticateUser, register);
// // router.post("/login", login);
// // router.get("/profile", authenticateUser, getProfile);

// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/authentication");
// const { register, login, getProfile } = require("../controllers/auth");

// // Register → Admin only
// router.post("/register", auth, allowRoles("admin"), register);
// router.post("/login", login);

// // Profile → All logged-in users
// router.get("/profile", auth, allowRoles("admin", "manager", "assistant", "broker"), getProfile);

// module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");
const allowRoles = require("../middleware/roleMiddleware"); // <- ye missing tha
const { register, login, getProfile } = require("../controllers/auth");

// Register → sirf Admin
router.post("/register", auth, allowRoles("admin"), register);
router.post("/login", login);
router.get("/profile", auth, getProfile);

module.exports = router;
