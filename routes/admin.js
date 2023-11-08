const express = require("express");

const router = express.Router();
const postController = require("../controllers/post");

const { body } = require("express-validator");
// const {isLogin} = require("../middleware/isLogin");

/* /admin/create-post isLogin is middleware*/
//router.get("/create-post", isLogin, postController.renderCreatePage);

router.get("/create-post", postController.renderCreatePage);

router.post(
  "/",
  [
    body("title")
      .isLength({ min: 10 })
      .withMessage("Title must have 10 letters."),
    body("description")
      .isLength({ min: 30 })
      .withMessage("Description must have 30 letters."),
  ],
  postController.createPost
);


router.get("/edit/:postId", postController.getEditPost);

router.post("/edit-post", postController.updatePost);

router.post("/delete/:postId", postController.deletePost);

router.get("/save/:id", postController.downloadPdf);

module.exports = router;