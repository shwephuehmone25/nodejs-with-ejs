const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const User = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    // name: {
    //     type: Sequelize.STRING,
    //     allowNull: false
    // },
    // email: {
    //     type: Sequelize.TEXT,
    //     allowNull: false
    // },
    // password: {
    //     type: Sequelize.STRING,
    //     allowNull: false
    // },
});

module.exports = User;