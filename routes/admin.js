const express = require("express");

const router = express.Router();
const postController = require("../controllers/post");
// const {isLogin} = require("../middleware/isLogin");

/* /admin/create-post isLogin is middleware*/
//router.get("/create-post", isLogin, postController.renderCreatePage);

router.get("/create-post", postController.renderCreatePage);

router.post("/", postController.createPost);

router.get("/edit/:postId", postController.getEditPost);

router.post("/edit-post", postController.updatePost);

router.post("/delete/:postId", postController.deletePost);

module.exports = router;