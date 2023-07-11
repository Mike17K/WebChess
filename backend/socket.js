import { Server } from "socket.io";
import {validateAccessKey} from './routes/routerUsers/usersPiplines.js'
const gamesApi = await import('./api/gamesApi.js');

const io = new Server({
  cors: {
    origin: "http://localhost:3000"
  }
});

// Middleware function to check for access key
const checkAccessKey = (socket, next) => {
  const { query } = socket.handshake;
  
  if(query.scope === 'chessgame'){
    const {accessServerKey,profileId,chessGameid,chessGameAccessKey} = query;
    // validate user // TODO propably here no need to check for user if the game is public
    validateAccessKey(profileId, accessServerKey, async ()=>{
      console.log("user valid");
      // chessgame 
      const isValid = await gamesApi.validateAccessToken({ accessKey:chessGameAccessKey,gameId:chessGameid});
      
      // If the access key is valid
      if(isValid){
        next();
      }
      
      return  
    })
    return 
  }

// If the access key is missing, decline the connection
return next(new Error("Errors."));
};

// Apply the middleware to all incoming connections
io.use(checkAccessKey);

io.on('connection', (socket) => {
  console.log('a user connected');
  // socket.handshake conains the info about the game and room
  // the middleware is job is to validate users for each game based on the visibility of the game the want to access
  socket.join(socket.handshake.query.chessGameid); // join a room of chess
  const room = socket.to(socket.handshake.query.chessGameid) // not good practice but it has to be for security purpuses for the private rooms if someone changes the socket.chessGameid later when the middleware is not applied

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('mousedown', (e) => {
    console.log('user mousedown: ',e.profileId);
    // !!!
    // i dont know about security on this method | if the client changes the chessGameid while he has connection he can access diferent rooms without validating
    room.emit('mousedown', {profileId:e.profileId,data:e.data});
  });
});

export default io;
