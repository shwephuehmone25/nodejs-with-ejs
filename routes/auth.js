const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

/**render register page */
router.get("/register", authController.registerPage);

/**handle register page */
router.post("/register", authController.register);

/**render login page */
router.get("/login", authController.getLoginPage);

/**handle login page */
router.post("/login", authController.postLoginPage);

/**render logout page */
router.post("/logout", authController.logout);

module.exports = router;
