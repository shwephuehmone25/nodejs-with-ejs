const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodeMailer = require("nodemailer");
const dotenv = require("dotenv").config();
const crypto = require("crypto");

const sender = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

/**render register */
exports.registerPage = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/register", { title: "Register", errMsg: message });
};

/**handle register */
exports.register = (req, res) => {
  const { email, password } = req.body;
  //console.log(email,password);
  User.findOne({ email })
    .then((user) => {
      if (user) {
        req.flash("error", "Email has already exists");
        return res.redirect("/register");
      }
      return bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          return User.create({
            email,
            password: hashedPassword,
          });
        })
        .then((_) => {
          return res.redirect("/login");
          sender.sendMail(
            {
              from: process.env.SENDER_MAIL,
              to: email,
              subject: "Registeration Success",
              html: "<h1>Register is success.</h1>",
            },
            (err) => {
              console.log(err);
            }
          );
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

/**render login page */
exports.getLoginPage = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", { title: "Login", errMsg: message });
};

/**handle login */
exports.postLoginPage = (req, res) => {
  //res.setHeader("Set-Cookie", "isLogIn=true");
  //(req.session.isLogIn = true), res.redirect("/");
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Credentials does not match and try again.");
        return res.redirect("/login");
      }
      /** compare password/ bcrypt.compare(password,user.hashedpassword); */
      bcrypt.compare(password, user.password).then((isEqual) => {
        if (isEqual) {
          req.session.isLogIn = true;
          req.session.userInfo = user;
          return req.session.save((err) => {
            res.redirect("/");
            console.log(err);
          });
        }
        res.redirect("/login");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

/**handle logout */
exports.logout = (req, res) => {
  req.session.destroy((_) => {
    res.redirect("/");
  });
};

/**render reset page*/
exports.resetPassword = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", { title: "Reset Password", errMsg: message });
};

/**render feedback page */
exports.getFeedback = (req, res) => {
  res.render("auth/feedback", { title: "Success" });
};

/**handle reset password*/
exports.resetLinkSend = (req, res) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset-password");
    }
    const token = buffer.toString("hex");
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Email doesn't exist");
          return res.redirect("/reset-password");
        }
        user.resetToken = token;
        user.tokenExperiation = Date.now() + 18000000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/feedback");
        sender.sendMail(
          {
            from: process.env.SENDER_MAIL,
            to: email,
            subject: "Reset Password",
            html: `<h1>Reset password.</h1><p>Change your account password by clicking the link below.</p><a href="http://localhost:8080/reset-password/${token}" target="_blank">Click me to change password !!</a>`,
          },
          (err) => {
            console.log(err);
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

/**handle newpassword page  */
exports.getnewPasswordPage = (req, res) => {
  const { token } = req.params;
  console.log(token);
  User.findOne({
    resetToken: token,
    tokenExperiation: { $gt: Date.now() },
  })
    .then((user) => {
      if(user){
        let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/newPassword", { 
        title: "Change Password",
        errMsg: message,
        resetToken: token,
        user_id:  user_id.toString(),
      });
      }  else{
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

/**render newpassword page */
exports.changeNewPassword = (req, res) => {
    const { password, confirm_password, user_id, resetToken } = req.body;
    let resetUser;
    User.findOne({
        resetToken: token,
        tokenExperiation: { $gt: Date.now() },
        _id: user_id
    })
    .then( user => {
      
    if(password === confirm_password){
      resetUser = user
      return bcrypt.hash(password, 10)
    }
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.tokenExperiation = undefined;
      return resetUser.save();
    })
    .then(() =>{
    res.redirect("/login");
    })
    .catch(err => {
      console.log(err);
    })
}
