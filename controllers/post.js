const Post = require("../models/post");

/**create post in mongoose */
exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;
  Post.create({ title, description, image_url: photo, userId: req.user })
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.renderCreatePage = (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "addPost.html"));
  res.render("addPost", { title: "Create Post" });
};

exports.renderHomePage = (req, res) => {
/**get title only direct from post model*/
  Post.find()
  .select("title")
  /**populate is get only username from user model in relationship */
  .populate("userId", "username")
  /**Sort post by desc if 1 & -1 is asc in mongoose */
    .sort({ title: -1 })
    .then((posts) => res.render("home", { title: "Homepage", postsArr: posts }))
    .catch((err) => console.log(err));
};

/**get post details in mongoose */
exports.getPost = (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => res.render("postDetails", { title: post.title, post }))
    .catch((err) => console.log(err));
};

/**get edit post data in mongoose by findById*/
exports.getEditPost = (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.redirect("/");
      }
      res.render("editPost", { title: post.title, post });
    })
    .catch((err) => console.log(err));
};

/**edit post data in mongoose by findById*/
exports.updatePost = (req, res) => {
  const { postId, title, description, photo } = req.body;

  Post.findById(postId)
    .then((post) => {
      post.title = title;
      post.description = description;
      post.image_url = photo;
      return post.save();
    })
    .then(() => {
      console.log("Post Updated");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

/**Delete post by id in mongoose by findByIdAndRemove method*/
exports.deletePost = (req, res) => {
  const { postId } = req.params;
  Post.findByIdAndRemove(postId)
    .then(() => {
      console.log("Post Deleted!!");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};