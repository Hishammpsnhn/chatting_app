const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    name: { type: String,required:true },
    email: { type: String,required:true },
    password: { type: String,required:true },
    pic: {
         type: String,
         required:true,
         default:"https://th.bing.com/th/id/OIP.16nCki_lmFTArVKtj1Gs_QHaHY?w=215&h=214&c=7&r=0&o=5&dpr=1.25&pid=1.7" 
        },

},
    {
        timestamps: true,
    }
)

const Users = mongoose.model("User",userModel);
module.exports  = Users;