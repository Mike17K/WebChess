import { Server } from "socket.io";
import {validateAccessKey} from './routes/routerUsers/usersPiplines.js'
const gamesApi = await import('./api/gamesApi.js');
const usersApi = await import('./api/usersApi.js');

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



const users = []

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room)
}

io.on('connection', async (socket) => {
  console.log('a user connected');
  
  const roomId = socket.handshake.query.chessGameid;
  const profileId = socket.handshake.query.profileId; // i can add hash here propably for security
  const profile = await usersApi.getProfile({ profileId, userMode:"OWNER" });

  socket.join(roomId);
  const room = socket.to(roomId);
  const user = { id: profileId, name: profile.name, rating: 1900, picture:4, room:roomId,move: null };// TODO get the rating from the database
  users.push(user); 
  room.emit('user-connected', user);

  socket.on('chat-message', (msg) => {
    // msg: {icon, username, message}
    socket.emit('chat-message', msg);
    room.emit('chat-message', msg);
  });



  socket.on('get-room-data', () => {
    socket.emit('sent-room-data', getUsersInRoom(roomId));
  });

  socket.on('unvote-move', ({sqIDFrom,sqIDTo,userId}) => {
    // here it should be checked with the use of jwt TODO
    const move = `${sqIDFrom}-${sqIDTo}`;
    const user = users.filter((user) => user.id === userId)[0]
    if (!user) return;
    user.move = null;
    console.log("unvoted-move: ",move);

    socket.emit('unvoted-move', {move:move});
    room.emit('unvoted-move', {move:move});
  });

  
  socket.on('vote-move', ({sqIDFrom,sqIDTo,userId}) => {
    // here it should be checked with the use of jwt TODO
    const move = `${sqIDFrom}-${sqIDTo}`;
    users.filter((user) => user.id === userId)[0].move = move;
    console.log("voted-move: ",move);
    socket.emit('voted-move', {move:move});
    room.emit('voted-move', {move:move});
  });


  socket.on('disconnect', () => {
    console.log('user disconnected');
    // remove the user from the users array
    const index = users.findIndex((user) => user.id === profileId)
    room.emit('user-disconnected', profileId);  
    if (index !== -1) {
      return users.splice(index, 1)[0]
    }
    
  } )
  
  socket.on('moved-piece', (msg) => {
    console.log('user moved-piece: ',msg);
    users.forEach(user => {
      user.move = null;
    });
    room.emit('moved-piece', msg);
  });
  
  socket.on('mousedown', (e) => {
    console.log('user mousedown: ',e.profileId);
    // !!!
    // i dont know about security on this method | if the client changes the chessGameid while he has connection he can access diferent rooms without validating
    room.emit('mousedown', {profileId:e.profileId,data:e.data});
  });
});

export default io;
