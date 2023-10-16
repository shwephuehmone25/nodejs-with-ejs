const express = require("express");
const path = require("path");

const router = express.Router();
const postController = require("../controllers/post");
// const posts = [];

router.get("/create-post", (req, res) => {
 //res.sendFile(path.join( __dirname, "..", "views", "addPost.html"));
 res.render("addPost", { title : "Add Post"});
});

// router.post("/", (req, res) => {
//     //console.log(req.body);
//     const { title, description} = req.body;
//     //res.json(req.body);
//     console.log(`Title value is ${title} and description is ${description}`);
//     posts.push({
//         title,
//         description
//     });
//     console.log(posts);
//     res.redirect("/");
//  });

router.post("/", postController.createPost);

/* /admin/post/edit/id getOldPost*/
router.get("/edit-post/:postId", postController.getOldPost);

/* /admin/post/edit */
router.post("/edit-post", postController.updatePost);

/* /admin/post/id */
router.post("/post/:postId", postController.deletePost);

// module.exports = {adminRouter : router, posts};
module.exports = {adminRouter : router};