require('dotenv').config();

let DB_URL = process.env.MONGODB_URL;

module.exports = {
  DB_URL,
};
