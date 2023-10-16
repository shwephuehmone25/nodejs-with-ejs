const express = require("express");
const path = require("path");
/**import to read data from client*/
const bodyParser = require("body-parser");

const sequelize = require("./utils/database");
const Post = require("./models/post");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const postRouter = require("./routes/post");
const { adminRouter } = require("./routes/admin");

/*use static file from public like css file*/
app.use(express.static(path.join(__dirname, "public")));

/*to read data from client with json format*/
app.use(express.json());

/*to read direct data from client*/
app.use(bodyParser.urlencoded({ extended: false }));

/*next is a middleware*/
app.use("/post", (req, res, next) => {
    console.log("i am post middleware");
    /*continue other function if success*/
    next();
});

app.use((req, res, next) => {
    console.log("i am next middleware");
    next();
});

/* app.get("/",(req, res) => {
    // res.send("<h1>I am Home Page</h1>")
    //send file without import path
    //res.sendFile("./views/home.html", {root : __dirname});
    //send file with import path
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/post",(req, res) => {
    res.sendFile(path.join(__dirname, "views", "post.html"));
}) */
app.use("/admin", (req, res, next) => {
    console.log("I am admin");
    next();
});

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user; 
        console.log(user);
        next();
    }).catch( err => { 
        console.log(err);
    })
})

app.use(postRouter);
app.use("/admin", adminRouter);

/**connect foreign key of user_id in posts & post_id in users*/
Post.belongsTo(User, {constraints : true, onDelete: "CASCADE" });
User.hasMany(Post);

// sequelize.sync({force: true})
sequelize.sync()
    .then(result => {
        // console.log(result);
        return User.findByPk(1)
        .then( user =>{
            if(!user){
                return User.create({name: "shwephue", email: "shwephue@gmail.com"});
            }
            return user;
        })
        .then((user) => {
            console.log(user);
            app.listen(4000);
        })
        
    }).catch(err => {
        console.log(err);
    })
