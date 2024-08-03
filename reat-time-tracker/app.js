const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const app = express();

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket){
  console.log('New client connected:', socket.id);
  socket.on("send-location", function(data){
    console.log('Location received from:', socket.id, data);
    io.emit("recieved-location", {id: socket.id, ...data });
  });
  socket.on("disconnect", function(){
    console.log('Client disconnected:', socket.id);
    io.emit("user-disconnect", socket.id);
  });
});

app.get("/", function(req, res) {
  res.render("index");
});

server.listen(4000, () => {
  console.log("Port running at localhost:4000");
});
