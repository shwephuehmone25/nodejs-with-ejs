const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

/**import routes */
const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");
const User = require("./models/user");
const authRoutes = require("./routes/auth");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

/**find user by id in database */
app.use("/", (req, res, next) => {
  User.findById("652f9aa9d52887c89955b373")
  .then( user => {
    req.user = user
    next()
  })
});

/**Register route */
app.use("/admin", adminRoutes);
app.use(postRoutes);
app.use(authRoutes);

mongoose
  .connect(process.env.MONGODB_URL)
  .then((res) => {
    // console.log(res);
    app.listen(4000);
    console.log("Connected to mongodb!!!");

    return User.findOne()
    .then(user => {
      if(!user)
      {
        User.create(
          { username : "shwephue",
           email: "shwephue7889@gmail.com", 
           password: "111111"
          })
      }
      return user;
    })
  }).then(result => {
    console.log(result);
  })
  .catch((err) => console.log(err));