import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3000"
  }
});

// Middleware function to check for access key
const checkAccessKey = (socket, next) => {
  const { query } = socket.handshake;
  //console.log(query);
  
  if(query.scope === 'chessgame'){
    const {accessServerKey,profileId,chessGameid,chessGameAccessKey} = query;
    // If the access key is valid, allow the connection to proceed TODO
    return next(); 
  }

// If the access key is missing, decline the connection
return next(new Error("Errors."));
};

// Apply the middleware to all incoming connections
io.use(checkAccessKey);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

export default io;
