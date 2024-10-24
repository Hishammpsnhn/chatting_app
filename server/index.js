const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./config/db.js");
const userRoutes = require("./Routes/userRouter");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const notifRouter = require("./Routes/notifRouter");
const { notfound, errorhandler } = require("./middleware/errorHandlers.js");
const http = require("http");
const { Server } = require("socket.io");
const Users = require("./models/userModel.js");

const app = express();
dotenv.config();
const server = http.createServer(app);
app.use(express.json()); //accept json data
app.use(cors());
connectDb();

app.get("/", (req, res) => {
  res.send("Chatting app server started");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notifRouter);
app.use(notfound);
app.use(errorhandler);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET,POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("setup", async (userData) => {
    console.log(`User Connected: ${socket.id} `);
    socket.userId = userData._id;
    // const updatedUser = await Users.findByIdAndUpdate(
    //   userData._id,
    //   { status: "online" },
    //   { new: true }
    // );
    socket.broadcast.emit("userOnline", userData._id);
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room_id) => {
    socket.join(room_id);
    console.log("user joined room:" + room_id);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing", room));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new Message", (newMessageRecived) => {
    console.log("new masg received: " + newMessageRecived);
    var chat = newMessageRecived.chat;

    if (!chat.users) return console.log("chat.users not fouond");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageRecived);
    });
  });

  socket.on("disconnect", async () => {
    const userId = socket.userId;
    console.log(`User Disconnected: ${socket.id}${userId}`);
    // const updatedUser = await Users.findByIdAndUpdate(
    //   userId,
    //   { status: "offline" },
    //   { new: true }
    // );
    if (userId) {
      socket.broadcast.emit("userOffline", userId);
    }
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
