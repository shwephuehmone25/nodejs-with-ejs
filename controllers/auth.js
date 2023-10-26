const User = require("../models/user");
const bcrypt = require("bcrypt");

/**render register */
exports.registerPage = (req, res) => {

  let message = req.flash("error");
  if(message.length > 0) {
   message = message[0];
  }else{
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
        req.flash("error", "Email has already exists")
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
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

/**render login page */
exports.getLoginPage = (req, res) => {
  let message = req.flash("error");
  if(message.length > 0) {
   message = message[0];
  }else{
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
        req.flash("error", "Credentials does not match and try again.")
        return res.redirect("/login");
      }
      /** compare password/ bcrypt.compare(password,user.hashedpassword); */
      bcrypt
      .compare(password,user.password)
      .then(isEqual => {
        if(isEqual)
        {
            req.session.isLogIn = true;
            req.session.userInfo = user;
          return req.session.save( err => {
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
