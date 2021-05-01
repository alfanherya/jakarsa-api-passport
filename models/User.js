const Sequelize = require("sequelize");
const db = require("../config/db.config");

const User = db.define(
    "User",
    {
        nama: { type: Sequelize.STRING},
        alamat: { type: Sequelize.STRING},
        email: { type: Sequelize.STRING},
        password: { type: Sequelize.STRING},
    }
);

User.sync({});

module.exports = User;