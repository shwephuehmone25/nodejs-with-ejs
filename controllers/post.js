const { post } = require("../routes/post");

//const posts = [];

/**import post model */
const Post = require("../models/post");

/**Insert data with mysql2 */
// exports.createPost = (req, res) => {

//     const { title, description, image_url } = req.body;
//     //console.log(`Title value is ${title} and description is ${description}`);

//     /**save post into db*/
//     if (!title || !description || !image_url)
//      {
//         return res.status(400).send("Missing required data.");
//     }

//     const post = new Post(title, description, image_url);

//     post.insertPost()
//         .then(() => {
//             res.redirect("/");
//         })
//         .catch(err => {
//             console.error("Error inserting the post:", err);
//             res.status(500).send("Internal Server Error");
//         });

//     /**create post without db*/
//     // posts.push({
//     //     id: Math.random(),
//     //     title,
//     //     description,
//     //     image
//     // });
//     // console.log(posts);
//     // res.redirect("/");
// }

/**Insert data with sequalize build in method called create*/
exports.createPost = (req, res) => {

    const { title, description, image_url } = req.body;

    /**get userId like req.user.createPost */
    req.user
        .createPost({
            title,
            description,
            image_url,
            //userId: req.user.id
        }).then((result) => {
            console.log(result);
            console.log("New post created");
            res.redirect("/");
        })
        .catch(err => {
            console.log(err);
        })
}

exports.renderCreatePage = (req, res) => {

    res.render("addPost", { title: "Testing" })
}

/**getAll Data data with mysql2 */
// exports.getAllPosts = (req, res) => {
//     //console.log(posts);
//     /**res.render("pageName") */
//     Post.getAllPosts()
//         .then(([rows]) => {
//             console.log(rows);
//             res.render("home", { title: "Welcome", postArray: rows });
//         })
//         .catch(
//             err => console.log(err)
//         );
// }

/**getAll Data data with sequalize build in method called findAll*/
exports.getAllPosts = (req, res) => {

    Post.findAll({ order: [['createdAt', 'DESC']] })
        .then(posts => {
            res.render("home", { title: "Home", postArray: posts });
        }).catch(err => {
            console.log(err);
        });
}

// /**get single data with mysql2 */
// exports.getPost = (req, res) => {
//     const postId = req.params.postId;
//     console.log(postId);
//     // const post = posts.find(post => post.id == postId);
//     // console.log(post);
//     Post.getSinglePost(postId)
//         .then(
//             ([row]) => {
//                 res.render("postDetails", { title: "Post Details", post: row[0] });
//             }
//         )
//         .catch(
//             err => console.log(err)
//         );
//     //res.render("postDetails", { title: "Post Details", post });
// }

/**get single data with sequalize build in method called findOne*/
exports.getPost = (req, res) => {

    const postId = req.params.postId;
    /**findOne usage({where : {id : id}}) */
    Post.findOne({ where: { id: postId } })
        .then(post => {
            res.render("postDetails", { title: "Post Details", post });
        })
        .catch(
            err => console.log(err)
        );
}

/**get Old Value of related post by sequalize*/
exports.getOldPost = (req, res) => {

    const postId = req.params.postId;
    Post.findByPk(postId)
        .then(post => {
            res.render("editPost", { title: `${post.title}`, post });
        })
        .catch(
            err => console.log(err)
        );
}

/**Update Post */
exports.updatePost = (req, res) => {
    const { title, description, image_url, postId } = req.body;
    Post.findByPk(postId)
        .then(post => {
            if (!post) {
                const errorMessage = "Post not found.";
                throw new Error(errorMessage);
            }

            post.title = title;
            post.description = description;
            post.image_url = image_url;

            return post.save();
        })
        .then(result => {
            console.log(`Post Id => ${postId} is updated successfully`);
            res.redirect("/");
        })
        .catch(err => {
            console.error(`Error updating post: ${err.message}`);
            res.status(500).send("Error updating post: " + err.message);
        });
};

/**Delete post by id */
exports.deletePost = (req, res) => {
    const postId = req.params.postId;
    // console.log("delete" + postId);
    Post.findByPk(postId)
        .then((post) => {
            if (!post) {
                res.redirect("/");
            }
            return post.destroy()
                .then((result) => {
                    console.log("Post Deleted!!");
                    res.redirect("/");
                })
        }).catch(err => {
            console.log(err);
        });
}