const sequelize = require("sequelize");

const db = new sequelize("jakarsaf_api_db", "jakarsaf-deployer", "Herya2020!", {
    dialect: "mysql"
});

db.sync({});
module.exports = db;