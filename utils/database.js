/**connect to db with mysql2 */
// const mysql = require("mysql2");

// const pool = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     database: "node",
//     password: "root"
// })

// module.exports = pool.promise();

/**connect to db with sequalize */
const Sequelize = require("sequelize");

const sequelize = new Sequelize("node", "root", "root", {
    host: "localhost",
    dialect: "mysql",
});

module.exports = sequelize;
