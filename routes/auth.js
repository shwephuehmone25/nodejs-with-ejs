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

/**render feedback */
router.get("/feedback", authController.getFeedback);

/**render reset-password */
router.get("/reset-password", authController.resetPassword);

/**handle reset-password */
router.post("/reset", authController.resetLinkSend);

/**render reset-password */
router.get("/reset-password/:token", authController.getnewPasswordPage);

/*handle change new password*/
router.post("/change-new-password", authController.changeNewPassword);

/**render logout page */
router.post("/logout", authController.logout);

module.exports = router;
