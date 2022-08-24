const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const addNotification = asyncHandler(async (req, res) => {
 const user = req.body.users;
 console.log(req.user)   
//  user.forEach((user)=>{
//         if(req.user !== user) return;
//         console.log(user)
//     })

})
module.exports = {addNotification};
