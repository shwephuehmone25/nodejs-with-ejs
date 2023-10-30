// const express = require("express");
// const router = express.Router();
// const authController = require("../controllers/auth");

// /**render register page */
// router.get("/register", authController.registerPage);

// /**handle register page */
// router.post("/register", authController.register);

// /**render login page */
// router.get("/login", authController.getLoginPage);

// /**handle login page */
// router.post("/login", authController.postLoginPage);

// /**render feedback */
// router.get("/feedback", authController.getFeedback);

// /**render reset-password */
// router.get("/reset-password", authController.resetPassword);

// /**handle reset-password */
// router.post("/reset", authController.resetLinkSend);

// /**render reset-password */
// router.get("/reset-password/:token", authController.getnewPasswordPage);

// /*handle change new password*/
// router.post("/change-new-password", authController.changeNewPassword);

// /**render logout page */
// router.post("/logout", authController.logout);

// module.exports = router;


const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

// render register page
router.get("/register", authController.getRegisterPage);

// handle register
router.post("/register", authController.registerAccount);

// render login page
router.get("/login", authController.getLoginPage);

// handle login
router.post("/login", authController.postLoginData);

// handle logout
router.post("/logout", authController.logout);

// render rest password page
router.get("/reset-password", authController.getResetpage);

// render feedback page
router.get("/feedback", authController.getFeedbackPage);

// send reset email
router.post("/reset", authController.resetLinkSend);

// render change password page
router.get("/reset-password/:token", authController.getNewpasswordPage);

// change new password
router.post("/change-new-password", authController.changeNewpassword);

module.exports = router;