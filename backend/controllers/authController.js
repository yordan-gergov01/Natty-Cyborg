const jwt = require("jsonwebtoken");
const env = require("dotenv");

env.config({ path: "./../frontend/.env" });

const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
