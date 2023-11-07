// const User = require("../models/user");
// const bcrypt = require("bcrypt");
// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv").config();
// const crypto = require("crypto");

// const sender = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.SENDER_MAIL,
//     pass: process.env.MAIL_PASSWORD,
//   },
// });

// /**render register */
// exports.registerPage = (req, res) => {
//   let message = req.flash("error");
//   if (message.length > 0) {
//     message = message[0];
//   } else {
//     message = null;
//   }
//   res.render("auth/register", { title: "Register", errMsg: message });
// };

// /**handle register */
// exports.register = (req, res) => {
//   const { email, password } = req.body;
//   //console.log(email,password);
//   User.findOne({ email })
//     .then((user) => {
//       if (user) {
//         req.flash("error", "Email has already exists");
//         return res.redirect("/register");
//       }
//       return bcrypt
//         .hash(password, 10)
//         .then((hashedPassword) => {
//           return User.create({
//             email,
//             password: hashedPassword,
//           });
//         })
//         .then((_) => {
//           res.redirect("/login");
//           sender.sendMail(
//             {
//               from: process.env.SENDER_MAIL,
//               to: email,
//               subject: "Register Successful",
//               html: "<h1>Register account successful.</h1><p>Created an account using this email address in blog.io.</p>",
//             },
//             (err) => {
//               console.log(err);
//             }
//           );
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// /**render login page */
// exports.getLoginPage = (req, res) => {
//   let message = req.flash("error");
//   if (message.length > 0) {
//     message = message[0];
//   } else {
//     message = null;
//   }
//   res.render("auth/login", { title: "Login", errMsg: message });
// };

// /**handle login */
// exports.postLoginPage = (req, res) => {
//   //res.setHeader("Set-Cookie", "isLogIn=true");
//   //(req.session.isLogIn = true), res.redirect("/");
//   const { email, password } = req.body;
//   User.findOne({ email })
//     .then((user) => {
//       if (!user) {
//         req.flash("error", "Credentials does not match and try again.");
//         return res.redirect("/login");
//       }
//       /** compare password/ bcrypt.compare(password,user.hashedPassword); */
//       bcrypt.compare(password, user.password).then((isEqual) => {
//         if (isEqual) {
//           req.session.isLogIn = true;
//           req.session.userInfo = user;
//           return req.session.save((err) => {
//             res.redirect("/");
//             console.log(err);
//           });
//         }
//         res.redirect("/login");
//       })
//       .catch((err) => console.log(err));
//   })
//   .catch((err) => console.log(err));
// };

// /**handle logout */
// exports.logout = (req, res) => {
//   req.session.destroy((_) => {
//     res.redirect("/");
//   });
// };

// /**render reset page*/
// exports.resetPassword = (req, res) => {
//   let message = req.flash("error");
//   if (message.length > 0) {
//     message = message[0];
//   } else {
//     message = null;
//   }
//   res.render("auth/reset", { title: "Reset Password", errMsg: message });
// };

// /**render feedback page */
// exports.getFeedback = (req, res) => {
//   res.render("auth/feedback", { title: "Success" });
// };

// /**handle reset password*/
// exports.resetLinkSend = (req, res) => {
//   const { email } = req.body;
//   crypto.randomBytes(32, (err, buffer) => {
//     if (err) {
//       console.log(err);
//       return res.redirect("/reset-password");
//     }
//     const token = buffer.toString("hex");
//     User.findOne({ email })
//       .then((user) => {
//         if (!user) {
//           req.flash("error", "No account found with this email.");
//           return res.redirect("/reset-password");
//         }
//         user.resetToken = token;
//         user.tokenExpiration = Date.now() + 18000000;
//         return user.save();
//       })
//       .then((result) => {
//         res.redirect("/feedback");
//         sender.sendMail(
//           {
//             from: process.env.SENDER_MAIL,
//             to: email,
//             subject: "Reset Password",
//             html: `<h1>Reset password.</h1><p>Change your account password by clicking the link below.</p><a href="http://localhost:4000/reset-password/${token}" target="_blank">Click me to change password !!</a>`,
//           },
//           (err) => {
//             console.log(err);
//           }
//         );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   });
// };

// /**handle newPassword page  */
// exports.getnewPasswordPage = (req, res) => {
//   const { token } = req.params;
//   //console.log(token);
//   User.findOne({
//     resetToken: token,
//     tokenExpiration: { $gt: Date.now() },
//   })
//     .then((user) => {
//       if(user){
//         let message = req.flash("error");
//       if (message.length > 0) {
//         message = message[0];
//       } else {
//         message = null;
//       }
//       res.render("auth/newPassword", {
//         title: "Change Password",
//         errMsg: message,
//         resetToken: token,
//         user_id:  user._id,
//       });
//       }  else{
//         res.redirect("/");
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// /**render NewPassword page */
// exports.changeNewPassword = (req, res) => {
//     const { password, confirm_password, user_id, resetToken } = req.body;
//     let resetUser;
//     User.findOne({
//         resetToken: token,
//         tokenExpiration: { $gt: Date.now() },
//         _id: user_id
//     })
//     .then( user => {

//     if(password === confirm_password){
//       resetUser = user
//       return bcrypt.hash(password, 10)
//     }
//     })
//     .then(hashedPassword => {
//       resetUser.password = hashedPassword;
//       resetUser.resetToken = undefined;
//       resetUser.tokenExpiration = undefined;
//       return resetUser.save();
//     })
//     .then(() =>{
//     res.redirect("/login");
//     })
//     .catch(err => {
//       console.log(err);
//     })
// }

const bcrypt = require("bcrypt");
const User = require("../models/user");
const crypto = require("crypto");
/**import validator*/
const { validationResult } = require("express-validator");

const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

// render register page
exports.getRegisterPage = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/register", {
    title: "Register",
    errMsg: message,
    oldFormData: { email: "", password: "" },
  });
};

// handle register
exports.registerAccount = (req, res) => {
  const { email, password } = req.body;

  /**catch errors from validator*/
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/register", {
      title: "Register",
      errMsg: errors.array()[0].msg,
      oldFormData: { email, password },
    });
  }

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      return User.create({
        email,
        password: hashedPassword,
      });
    })
    .then((_) => {
      res.redirect("/login");
      transporter.sendMail(
        {
          from: process.env.SENDER_MAIL,
          to: email,
          subject: "Register Successful",
          html: "<h1>Register account successful.</h1><p>You have been created an account using this email address in medium.com</p>",
        },
        (err) => {
          console.log(err);
        }
      );
    });
};

// render login page
exports.getLoginPage = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
     title: "Login", 
     errMsg: message,
     oldFormData: { email: "", password: "" },
     });
};

// handle login
exports.postLoginData = (req, res) => {
  const { email, password } = req.body;
  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //console.log(errors);
    return res.status(422).render("auth/login", {
      title: "Login",
      errMsg: "Please enter vaild email and password.",
      oldFormData: { email, password },
    });
  }

  User.findOne({ email })
  .then((user) => {
    if (!user) {
      return res.status(422).render("auth/login", {
        title: "Login",
        errMsg: "Please enter vaild email and password.",
        oldFormData: { email, password },
      });
    }
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            req.session.isLogin = true;
            req.session.userInfo = user;
            return req.session.save((err) => {
              res.redirect("/");
              console.log(err);
            });
          }
          res.redirect("/login");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Something Went Wrong");
      return next(error);
    });
};

// handle logout
exports.logout = (req, res) => {
  req.session.destroy((_) => {
    res.redirect("/");
  });
};

// render rest password page
exports.getResetpage = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", { title: "Reset Password", errMsg: message });
};

// render feedback page
exports.getFeedbackPage = (req, res) => {
  res.render("auth/feedback", { title: "Success." });
};

// reset password link send
exports.resetLinkSend = (req, res) => {
  const { email } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/reset", {
      title: "Reset Password",
      errorMsg: errors.array()[0].msg,
      oldFormData: { email },
    });
  }

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset-password");
    }
    const token = buffer.toString("hex");
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.status(422).render("auth/reset", {
            title: "Reset Password",
            errorMsg: "No account exist with this email address.",
            oldFormData: { email },
          });
        }
        user.resetToken = token;
        user.tokenExpiration = Date.now() + 1800000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/feedback");
        transporter.sendMail(
          {
            from: process.env.SENDER_MAIL,
            to: email,
            subject: "Reset Password",
            html: `<h1>Reset password.</h1><p>Change your account password by clicking the link below.</p><a href="http://localhost:4000/reset-password/${token}" target="_blank">Click me to change password !!</a>`,
          },
          (err) => {
            console.log(err);
          }
        );
      })
      .catch((err) => {
        console.log(err);
        const error = new Error("Something Went Wrong");
        return next(error);
      });
  });
};

/**render change password*/
exports.getNewpasswordPage = (req, res) => {
  const { token } = req.params;
  User.findOne({ resetToken: token, tokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (user) {
        let message = req.flash("error");
        if (message.length > 0) {
          message = message[0];
        } else {
          message = null;
        }
        res.render("auth/new-password", {
          title: "Change password",
          errMsg: message,
          resetToken: token,
          user_id: user._id,
          oldFormData: { password: "", confirm_password: "" },
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Something Went Wrong");
      return next(error);
    });
};

/**handle change password*/
exports.changeNewpassword = (req, res) => {
  const { password, confirm_password, user_id, resetToken } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/new-password", {
      title: "Change password",
      resetToken,
      user_id,
      errMsg: errors.array()[0].msg,
      oldFormData: { password, confirm_password },
    });
  }

  let resetUser;
  User.findOne({
    resetToken,
    tokenExpiration: { $gt: Date.now() },
    _id: user_id,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.tokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => {
      res.redirect("login");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Something Went Wrong");
      return next(error);
    });
};