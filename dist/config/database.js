"use strict";require('dotenv').config()

module.exports = {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  define: {
    timespamps: true,
    underscored: true,
    underscoredAll: true,
  },
}
