//  const express = require('express');

//  const http = require('http');

//  const socket = require('socket.io')
//  const {Chess}  = require('chess.js');
//  const path = require("path");
// const { title } = require('process');

//   const app = express();

//   const server = http.createServer(app);

//   const io = socket(server);

//   const chess = new Chess();

//   let players ={};
//   let currentPlayers = "w";

//   app.set("view engine","ejs");

//   app.use(express.static(path.join( __dirname,"public")));


// app.get("/",(req,res)=>
// {
//     res.render("index",{title:"Chess Game"});

// });

// io.on("connection",function(uniquesocket)
// {
//   console.log("connected");

//     if(!players.white)
//     {
//       players.white = uniquesocket.id;
//       uniquesocket.emit("playerRole","w");

//     }
//     else if(!players.black)
//     {
//       players.black = uniquesocket.id;
//       uniquesocket.emit("playerRole","b");

//     }
//     else{
//       uniquesocket.emit("spectatorRole");
//     }

//  uniquesocket.on("disconnect",function()
//  {
//   if(uniquesocket.id === players.white)
//   {
//     delete players.white;

//   }
//   else if(uniquesocket.id === players.black)
//   {
//     delete players.black;
//   }
//   });

//   uniquesocket.on("move",function(move)
// {
//   try{
//     if(chess.turn()==="w" && uniquesocket.id !== players.white) return;
//     if(chess.turn() ==="b" && uniquesocket.id !==players.black)  return;

//     const result = chess.move(move);

//     if(result)
//     {
//       currentPlayers = chess.turn();
//       io.emit("move",move);
//       io.emit("boardstate",chess.fen());
//     }
//     else{
//       console.log("invalid move:",move);
//       uniquesocket.emit("invalidMove",move);
//     }
//   }
//   catch(err)
//   {
//     console.log(err);
//     uniquesocket.emit("invalid move",move);

//   }
//       });
// });



// server.listen(3000,function()
// {
//     console.log(" listening at 3000");
    
// });




const express = require("express");
const http = require("http");
const socket = require("socket.io");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayers = "w";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Chess Game" });
});

io.on("connection", (socket) => {
  console.log("connected");

  if (!players.white) {
    players.white = socket.id;
    socket.emit("playerRole", "w");
  } else if (!players.black) {
    players.black = socket.id;
    socket.emit("playerRole", "b");
  } else {
    socket.emit("spectatorRole");
  }

  socket.on("disconnect", () => {
    if (socket.id === players.white) delete players.white;
    if (socket.id === players.black) delete players.black;
  });

  socket.on("move", (move) => {
    try {
      if (chess.turn() === "w" && socket.id !== players.white) return;
      if (chess.turn() === "b" && socket.id !== players.black) return;

      const result = chess.move(move);
      if (result) {
        currentPlayers = chess.turn();
        io.emit("move", move);
        io.emit("boardstate", chess.fen());
      } else {
        socket.emit("invalidMove", move);
      }
    } catch (err) {
      console.log(err);
      socket.emit("invalidMove", move);
    }
  });
});

server.listen(3000, () => {
  console.log("Server listening at http://localhost:3000");
});
