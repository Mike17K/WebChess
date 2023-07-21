
import express from 'express';
import { router } from './routes/router.js';
import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import { removeExpiredTokensFromDb } from './api/usersApi.js';

setInterval(removeExpiredTokensFromDb, 1000 * 60 * 60 * 24); // 24 hours

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(cookieParser('keyboard cat'));
app.use(session({
  secret: process.env.secret || "PynOjAuHetAuWawtinAytVunarAcjeBlybEshkEjVudyelwa",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: true,
    maxAge: 1000000 // Time is in miliseconds
  }
}));
app.use(flash());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('public'));
app.use(router);

const server = app.listen(5050, () => {
  console.log('Web server started at port 5050...');
});


// Socket.io connections
import io  from './socket.js';
io.attach(server);