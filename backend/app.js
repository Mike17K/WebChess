import express from 'express';

import { router } from './routes/router.js';

import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000',
}));

/////////////////////////////////////////////////////////////////////////////////// fix the logic to have session !!!!!!!!!!!!!!!!!!!!!
app.use(cookieParser('keyboard cat'));
app.use(session({
    secret: process.env.secret || "PynOjAuHetAuWawtinAytVunarAcjeBlybEshkEjVudyelwa",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: true,
        maxAge: 1000000 // Time is in miliseconds
    },
    // store: new MemoryStore({ checkPeriod: 86400000 })
}
));
app.use(flash());
app.use(bodyParser.json()); 
app.use(express.json()); 

///////////////////////////////////////////////////////////////////////////////////

app.use(express.urlencoded());
app.use(express.static('public'));

app.use(router);

app.listen(5050, () => {
    console.log('Web server started at post 5050...');
});

