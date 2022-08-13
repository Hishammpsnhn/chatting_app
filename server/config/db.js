const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config();
const connectDb =async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            UseUnifiedTopology: true
        })
        console.log(`mongodb connected ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}
module.exports=connectDb;