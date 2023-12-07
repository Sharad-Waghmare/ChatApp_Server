import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";
import messageRoute from "./routes/messageRoute"

var app = express();
require("dotenv").config();
const cors = require("cors");
const socket = require("socket.io");

var PORT = process.env.PORT || PORT;

app.use(cors())
app.use(express.json());
app.use(express.static(__dirname));


const server = app.listen(PORT, ()=>{
    console.log("Server running on " + PORT); 
});


mongoose.connect(process.env.MONGO_URL, {
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

  const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.message);
      }
    });
  });


app.use('/api/auth', userRoute);
app.use('/api/messages', messageRoute)
