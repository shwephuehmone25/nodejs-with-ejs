/**crud with mysql2 */
// const db = require("../utils/database");

// module.exports = class Post {
//     constructor(title, description, image_url) {
//         this.title = title;
//         this.description = description;
//         this.image_url = image_url;
//     }

//     insertPost()
//     {
//         return db.execute("INSERT INTO posts (title, description, image_url) VALUES(?, ?, ?)", [this.title, this.description, this.image_url]);
//     }

//     static getAllPosts()
//     {
//     return db.execute("SELECT * FROM posts");
//     }

//     static getSinglePost(id) 
//     {
//         return db.execute("SELECT * FROM posts WHERE posts.id = ? ", [id]);
//     }
// }

const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

/**Create tables*/
const Post = sequelize.define("post", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    image_url: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

module.exports = Post;