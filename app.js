const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv").config();
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

/**import routes */
const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

const User = require("./models/user");
const {isLogin} = require("./middleware/is-Login");

const { localsName } = require("ejs");

var store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: "sessions"
});

const csrfToken = csrf();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

/**Send session*/
app.use(session({ 
  secret : process.env.SESSION_KEY,
   resave: false, 
   saveUninitialized: false,
   store,
  }));

/**middleware imports/release csrf token in every request */
app.use(csrfToken);
app.use(flash());

/**find user by id in database */
 app.use("/", (req, res, next) => {
  // console.log(req.session.isLogIn);
  // console.log(req.session.userInfo_id);
  if(req.session.isLogIn === undefined)
  {
   return next();
  }
  User.findById(req.session.userInfo_id).select('_id', 'email')
  .then( user => {
    req.user = user
    next();
  })
 });

 /**send csrf token for every page */
app.use((req, res, next) => {
  res.locals.isLogIn = req.session.isLogIn ? true : false, 
  /**release csrf token from express*/     
  res.locals.csrfToken = req.csrfToken();
  next();
})

/**Register route & insert middleware*/
app.use("/admin", isLogin, adminRoutes);
app.use(postRoutes);
app.use(authRoutes);

mongoose
  .connect(process.env.MONGODB_URL)
  .then((res) => {
    // console.log(res);
    app.listen(4000);
    console.log("Connected to mongodb!!!");

    /**create custom user */
    // return User.findOne()
    // .then(user => {
    //   if(!user)
    //   {
    //     User.create(
    //       { username : "shwephue",
    //        email: "shwephue7889@gmail.com", 
    //        password: "111111"
    //       })
    //   }
    //   return user;
    // })
  })
  // .then(result => {
  //   console.log(result);
  // })
  .catch((err) => console.log(err));