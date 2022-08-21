const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  console.log("called protect")
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      const token =  req.headers.authorization.split(" ")[1];
      console.log(token);
      const isCustomAuth = token.length < 500;
      let decodeData;
      if (token && isCustomAuth) {
        decodeData = jwt.verify(token, "test");
        req.user = await UserModel.findById(decodeData.id).select("-password");        
      }
      next();
    } catch (error) {
      console.log(error);
    }
  }
});
module.exports = { protect };
