const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/db.js");
const userRoutes = require("./Routes/userRouter");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const { notfound, errorhandler } = require("./middleware/errorHandlers.js");

dotenv.config();
const app = express();
app.use(express.json()); //accept json data
connectDb();


app.get("/", (req, res) => {
  res.send("chatting app server  ");
});
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);

app.use(notfound);
app.use(errorhandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
