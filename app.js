const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv").config();
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

/**import routes */
const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

/**import models*/
const User = require("./models/user");

/**import controllers*/
const errorController = require("./controllers/error");

/**import middleware*/
const { isLogin } = require("./middleware/is-Login");

//const { localsName } = require("ejs");

const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: "sessions",
});

const csrfToken = csrf();

/**insert file type */
const storageConfigure = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

/**Check file type*/
const fileFilterConfigure = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  multer({ storage: storageConfigure, fileFilter: fileFilterConfigure }).single(
    "photo"
  )
);

/**Send session*/
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(csrfToken);
app.use(flash());

/**middleware imports/release csrf token in every request */
// app.use(csrfToken);
// app.use(flash());

// /**find user by id in database */
//  app.use("/", (req, res, next) => {
// console.log(req.session.isLogIn);
// console.log(req.session.userInfo_id);
//   if(req.session.isLogin === undefined)
//   {
//    return next();
//   }
//   User.findById(req.session.userInfo_id).select('_id', 'email')
//   .then( user => {
//     req.user = user
//     next();
//   })
//  });

/**middleware imports/release csrf token in every request */
app.use((req, res, next) => {
  if (req.session.isLogin === undefined) {
    return next();
  }
  User.findById(req.session.userInfo._id)
    .select("_id email")
    .then((user) => {
      req.user = user;
      next();
    });
});

// to send csrf token for every page render
app.use((req, res, next) => {
  res.locals.isLogin = req.session.isLogin ? true : false;
  res.locals.csrfToken = req.csrfToken();
  next();
});

/**send csrf token for every page */
app.use((req, res, next) => {
  (res.locals.isLogin = req.session.isLogin ? true : false),
    /**release csrf token from express*/
    (res.locals.csrfToken = req.csrfToken());
  next();
});

/**Register route & insert middleware*/
app.use("/admin", isLogin, adminRoutes);
app.use(postRoutes);
app.use(authRoutes);

/**handle error for no route */
app.all("*", errorController.get404Page);
app.use(errorController.get500Page);

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
