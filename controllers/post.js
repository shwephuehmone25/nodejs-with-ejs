// const Post = require("../models/post");
// const fileDelete = require("../utils/fileDelete");
// const pdf = require("pdf-creator-node");
// const fs = require("fs");

// const expath = require("path");

// /**create post in mongoose */
// exports.createPost = (req, res, next) => {
//   const { title, description } = req.body;
//   const image = req.file;
//   const errors = validationResult(req);

//   if (image === undefined) {
//     return res.status(422).render("addPost", {
//       title: "Post create",
//       errMsg: "Image extension must be jpg,png and jpeg.",
//       oldFormData: { title, description },
//     });
//   }

//   if (!errors.isEmpty()) {
//     return res.status(422).render("addPost", {
//       title: "Post create",
//       errMsg: errors.array()[0].msg,
//       oldFormData: { title, description },
//     });
//   }

//   Post.create({ title, description, image_url: image.path, userId: req.user })
//     .then((result) => {
//       res.redirect("/");
//     })
//     .catch((err) => {
//       console.log(err);
//       const error = new Error("Something Went Wrong");
//       return next(error);
//     });
// };

// exports.renderCreatePage = (req, res, next) => {
//   // res.sendFile(path.join(__dirname, "..", "views", "addPost.html"));
//   res.render("addPost", { title: "Create Post" });
// };

// exports.renderHomePage = (req, res, next) => {
//   /**isLogin is true */
//   // const cookie = req.get("Cookie").split("=")[1].trim() === "true";
//   // console.log(cookie);
//   // console.log("hello")
//   console.log(req.session.userInfo);
//   /**get title only direct from post model*/
//   Post.find()
//     .select("title")
//     /**populate is get only username from user model in relationship */
//     //.populate("userId", "username")
//     .populate("userId", "email")
//     /**Sort post by desc if 1 & -1 is asc in mongoose */
//     .sort({ title: -1 })
//     .then((posts) =>
//       res.render("home", {
//         title: "Homepage",
//         postsArr: posts,
//         //email: posts.email,
//         currentUserEmail: req.session.userInfo
//           ? req.session.userInfo.email
//           : "",
//         //  isLogIn: req.session.isLogIn ? true : false,
//         //  /**release csrf token from express*/
//         //  csrfToken: req.csrfToken()
//       })
//     )
//     .catch((err) => {
//       console.log(err);
//       const error = new Error("Something Went Wrong");
//       return next(error);
//     });
// };

// /**get post details in mongoose */
// exports.getPost = (req, res, next) => {
//   const postId = req.params.postId;
//   console.log(req.user);
//   Post.findById(postId)
//     .populate("userId", "email")
//     .then((post) => {
//       res.render("details", {
//         title: post.title,
//         post,
//         date: post.createdAt
//           ? formatISO9075(post.createdAt, { representation: "date" })
//           : undefined,
//         currentLoginUserId: req.session.userInfo
//           ? req.session.userInfo._id
//           : "",
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       const error = new Error("Post not found with this ID.");
//       return next(error);
//     });
// };

// /**get edit post data in mongoose by findById*/
// exports.getEditPost = (req, res, next) => {
//   const postId = req.params.postId;
//   Post.findById(postId)
//     .then((post) => {
//       if (!post) {
//         return res.redirect("/");
//       }
//       res.render("editPost", {
//         postId,
//         title: post.title,
//         post,
//         errMsg: "",
//         oldFormData: {
//           title: undefined,
//           description: undefined,
//         },
//         isValidationFail: false,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       const error = new Error("Something Went Wrong");
//       return next(error);
//     });
// };

// /**edit post data in mongoose by findById*/
// exports.updatePost = (req, res, next) => {
//   const { postId, title, description } = req.body;

//   const image = req.file;
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(422).render("editPost", {
//       postId,
//       title,
//       errMsg: errors.array()[0].msg,
//       oldFormData: { title, description },
//       isValidationFail: true,
//     });
//   }

//   Post.findById(postId)
//     .then((post) => {
//       if (post.userId.toString() !== req.user._id.toString()) {
//         return res.redirect("/");
//       }
//       post.title = title;
//       post.description = description;
//       if (image) {
//         /**call fileDelete function*/
//         fileDelete(post.imgUrl);
//         post.imgUrl = image.path;
//       }
//       return post.save().then(() => {
//         console.log("Post Updated");
//         res.redirect("/");
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       const error = new Error("Something Went Wrong");
//       return next(error);
//     });
// };

// /**Delete post by id in mongoose by findByIdAndRemove method*/
// // exports.deletePost = (req, res, next) => {
// //   const { postId } = req.params;
// //   Post.findByIdAndRemove(postId)
// //     .then(() => {
// //       console.log("Post Deleted!!");
// //       res.redirect("/");
// //     })
// //     .catch((err) => console.log(err));
// // };

// /**Delete post*/
// exports.deletePost = (req, res, next) => {
//   const { postId } = req.params;
//   Post.findById(postId)
//     .then((post) => {
//       if (!post) {
//         return res.redirect("/");
//       }
//       fileDelete(post.imgUrl);
//       return Post.deleteOne({ _id: postId, userId: req.user._id });
//     })
//     .then(() => {
//       console.log("Post Deleted!!");
//       res.redirect("/");
//     })
//     .catch((err) => {
//       console.log(err);
//       const error = new Error("Something Went Wrong");
//       return next(error);
//     });
// };

// //handle pdf download
// exports.downloadPdf = (req, res, next) => {
//   const { id } = req.params;
//   const templateUrl = `${expath.join(
//     __dirname,
//     "../views/template/template.html"
//   )}`;
//   const html = fs.readFileSync(templateUrl, "utf8");
//   const options = {
//     format: "A3",
//     orientation: "portrait",
//     border: "10mm",
//     header: {
//       height: "45mm",
//       contents: '<h4 style="text-align: center;">PDF Download</h4>',
//     },
//     footer: {
//       height: "28mm",
//       contents: {
//         first: "Cover page",
//         default:
//           '<span style="color: #444; text-align: center">@medium.com</span>',
//         last: "Last Page",
//       },
//     },
//   };
//   // let postData;
//   Post.findById(id)
//   .populate("userId", "email")
//   .lean()
//   .then((post) => {
//     const date = new Date();
//     const pdfSaveUrl = `${expath.join(
//       __dirname,
//       "../public/pdf",
//       date.getTime() + ".pdf"
//     )}`;
//     const document = {
//       html,
//       data: {
//         post,
//       },
//       path: pdfSaveUrl,
//       type: "",
//     };
//     pdf
//       .create(document, options)
//       .then((result) => {
//         console.log(result);
//         res.download(pdfSaveUrl, (err) => {
//           if (err) throw err;
//           fileDelete(pdfSaveUrl);
//         });
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   })
//   .catch((err) => {
//     console.log(err);
//     const error = new Error("Something Went Wrong");
//     return next(error);
//   });
// };


const Post = require("../models/post");
const { validationResult } = require("express-validator");
const formatISO9075 = require("date-fns/formatISO9075");
const pdf = require("pdf-creator-node");

const fs = require("fs");
const expath = require("path");

const fileDelete = require("../utils/fileDelete");

exports.createPost = (req, res, next) => {
  const { title, description } = req.body;
  const image = req.file;
  const errors = validationResult(req);

  if (image === undefined) {
    return res.status(422).render("addPost", {
      title: "Post create",
      errorMsg: "Image extension must be jpg,png and jpeg.",
      oldFormData: { title, description },
    });
  }

  if (!errors.isEmpty()) {
    return res.status(422).render("addPost", {
      title: "Post create",
      errorMsg: errors.array()[0].msg,
      oldFormData: { title, description },
    });
  }

  Post.create({ title, description, imgUrl: image.path, userId: req.user })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Something Went Wrong");
      return next(error);
    });
};

exports.renderCreatePage = (req, res, next) => {
  res.render("addPost", {
    title: "Post create",
    oldFormData: { title: "", description: "", photo: "" },
    errorMsg: "",
  });
};

exports.renderHomePage = (req, res, next) => {
  Post.find()
    .select("title description")
    .populate("userId", "email")
    .sort({ title: -1 })
    .then((posts) => {
      res.render("home", {
        title: "Homepage",
        postsArr: posts,
        currentUserEmail: req.session.userInfo
          ? req.session.userInfo.email
          : "",
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Something Went Wrong");
      return next(error);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .populate("userId", "email")
    .then((post) => {
      res.render("details", {
        title: post.title,
        post,
        date: post.createdAt
          ? formatISO9075(post.createdAt, { representation: "date" })
          : undefined,
        currentLoginUserId: req.session.userInfo
          ? req.session.userInfo._id
          : "",
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Post not found with this ID.");
      return next(error);
    });
};

exports.getEditPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.redirect("/");
      }
      res.render("editPost", {
        postId,
        title: post.title,
        post,
        errorMsg: "",
        oldFormData: {
          title: undefined,
          description: undefined,
        },
        isValidationFail: false,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Something Went Wrong");
      return next(error);
    });
};

exports.updatePost = (req, res, next) => {
  const { postId, title, description } = req.body;

  const image = req.file;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("editPost", {
      postId,
      title,
      errorMsg: errors.array()[0].msg,
      oldFormData: { title, description },
      isValidationFail: true,
    });
  }

  Post.findById(postId)
    .then((post) => {
      if (post.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      post.title = title;
      post.description = description;
      if (image) {
        fileDelete(post.imgUrl);
        post.imgUrl = image.path;
      }
      return post.save().then(() => {
        console.log("Post Updated");
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Something Went Wrong");
      return next(error);
    });
};

exports.deletePost = (req, res, next) => {
  const { postId } = req.params;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.redirect("/");
      }
      fileDelete(post.imgUrl);
      return Post.deleteOne({ _id: postId, userId: req.user._id });
    })
    .then(() => {
      console.log("Post Deleted!!");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Something Went Wrong");
      return next(error);
    });
};

exports.savePostAsPDF = (req, res, next) => {
  const { id } = req.params;
  const templateUrl = `${expath.join(
    __dirname,
    "../views/template/template.html"
  )}`;
  const html = fs.readFileSync(templateUrl, "utf8");
  const options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
      height: "20mm",
      contents:
        '<h4 style="text-align: center;">PDF DOWNLOAD FROM medium.IO</h4>',
    },
    footer: {
      height: "15mm",
      contents: {
        first: 'Cover page',
        2: 'Second page', 
        default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', 
        last: 'Last Page'
    }
    },
  };
  Post.findById(id)
    .populate("userId", "email")
    .lean()
    .then((post) => {
      const date = new Date();
      const pdfSaveUrl = `${expath.join(
        __dirname,
        "../public/pdf",
        date.getTime() + ".pdf"
      )}`;
      const document = {
        html,
        data: {
          post,
        },
        path: pdfSaveUrl,
        type: "",
      };
      pdf
        .create(document, options)
        .then((result) => {
          console.log(result);
          res.download(pdfSaveUrl, (err) => {
            if (err) throw err;
            fileDelete(pdfSaveUrl);
          });
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Something Went Wrong");
      return next(error);
    });
};