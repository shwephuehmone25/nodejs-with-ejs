const express = require("express");
const path = require("path");
const postController = require("../controllers/post");

// const {posts} = require("./admin");
const router = express.Router();

// router.get("/",(req, res) => {
//     console.log(posts);
//     /*"..", is quit from existing folder*/
//     //res.sendFile(path.join(__dirname, "..", "views", "home.html"));
//     /**render with  ejs*/
//     res.render("home", { title : "Welcome", postArray : posts });
// });

/** call getAllPosts function from controller*/
router.get("/", postController.getAllPosts);

router.get("/post/:postId", postController.getPost);

// router.get("/post",(req, res) => {
//     res.sendFile(path.join(__dirname, "..", "views", "post.html"));
// });

module.exports= router;