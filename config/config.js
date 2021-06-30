const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  development: {
    username: "root",
    password: "server1!",
    database: "pixelgames",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
