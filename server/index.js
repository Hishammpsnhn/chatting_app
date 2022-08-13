const express = require("express")
const dotenv = require("dotenv")
const connectDb = require("./config/db.js")

connectDb()
dotenv.config();
const app = express();

app.get("/", (req, res) => {
    res.send("chatting app server  ")
})
app.get("/api", (req, res) => {
    const data = [{
        _id: 5454454546,
        name: "hisham",
        age: 19
    }] 
    res.send(data)
    res.json(data)
})
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server is running on port : ${port}`)
})