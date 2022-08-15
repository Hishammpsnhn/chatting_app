const express = require("express")
const dotenv = require("dotenv")
const connectDb = require("./config/db.js")
const userRoutes = require("./Routes/userRouter")
dotenv.config();

connectDb()
const app = express();
app.use(express.json());//accept json data

app.get("/", (req, res) => {
    res.send("chatting app server  ")
})
app.use("/api/user",userRoutes)
// app.get("/api/user",(req, res) => {
//     res.send("chatting app server 545");
// })
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server is running on port : ${port}`)
})