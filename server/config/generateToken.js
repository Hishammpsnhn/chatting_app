const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")

dotenv.config();
const generateToken = (id) => {
return jwt.sign({ id },"test", {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
