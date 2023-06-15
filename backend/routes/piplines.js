import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
prisma.$connect()

/*
import { validateUser, addUser } from '../models/mysql/db_functions.mjs';

export const loggedIn = (req, res, next) => {
    if (req.session.name === undefined) {
        res.redirect('/signin');
    }
    else {
        next();
    }
};

export const isAdmin = (req, res, next) => {
    if (req.session.name === "Admin") {
        next();
    }
    else {
        res.redirect('/');
    }
};


export const home = (req, res) => {
    let isLogedIn = (req.session.name === undefined) ? false : true;
    res.render('pages/home', { style: 'home.css', title: "home page", script: "home.js", isLogedIn: isLogedIn });
}


export const loginPipe = [
    (req, res, next) => {
        validateUser({ username: req.body.email, password: req.body.password }).then(isLogedInRes => {
            if (isLogedInRes) {
                req.session.name = 'session-update';
                if (req.body.email === 'admin' && req.body.password === 'password') {
                    req.session.name = 'Admin';
                    console.log("admin loged in");
                } else {
                    console.log("user loged in");
                }
                req.session.username = req.body.email;
                next();
            } else {
                req.flash('alertMessage', 'Error loging in')
                res.redirect('/signin');
            }
        })
    },
    (req, res, next) => {
        res.redirect('/');
    }
]

export const registerPipe = [
    (req, res, next) => {
        addUser(req.body.username, req.body.password, 1 + Math.floor(Math.random() * 5)).then(isLogedInRes => {
            if (isLogedInRes) {
                req.session.name = 'session-update';
                req.session.username = req.body.username;
                next();
            } else {
                req.flash('alertMessage', 'Error loging in')
                res.redirect('/signup');
            }
        })
    },
    (req, res, next) => {
        res.redirect('/');
    }
];

export const signin = (req, res, next) => {
    let isLogedIn = (req.session.name === undefined) ? false : true;
    res.render('pages/signin', { style: 'signin.css', title: "login page", script: "signin.js", isLogedIn: isLogedIn, alertMessage: req.flash('alertMessage') });
};
export const signup = (req, res) => {
    let isLogedIn = (req.session.name === undefined) ? false : true;
    res.render('pages/signup', { style: 'signup.css', title: "signup page", script: "signup.js", isLogedIn: isLogedIn, alertMessage: req.flash('alertMessage') });
};

export const logout = (req, res) => {
    req.session.destroy((err) => { console.log("session destroyed") });
    res.redirect('/');
}

// TODO fix the functions to work with prisma
// FIX TODO we are not working with handlebars anymore
export const adminPipe = [loggedIn, isAdmin, (req, res) => {
    res.render('pages/admin', { style: 'admin.css', title: "admin page", script: "admin.js", isLogedIn: true });}];
    
*/
const Role = {
    USER: 0,
    ADMIN: 1
  }

function authRole(role) {
    return (req, res, next) => {
        if (req.session.role === role) {
            next();
        }
        else {
            res.send("Not allowed");
        }
    }
}

async function authUser(req, res, next) {
    // Authenticate the user
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    
    // check if user is in db and get the userid,role


    const userData = await prisma.user.findUnique({
        where: {
            email: email
        },
        select: {
            id: true,
            name: true,
            password: true
        }
    });
  
    // check if user exists
    if (userData.id == null) return res.sendStatus(403);
    // check if username and password are correct
    if (username !== userData.name) return res.sendStatus(403);
    if (password !== userData.password) return res.sendStatus(403);
    
    // this field defines what info its going to be stored in the token
    const user = { name: username, userId: userData.id }; 

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET); //, { expiresIn: '30s' });
    res.json({ accessToken: accessToken });
}
export const loginPipe = [authUser];

function authToken(req, res, next) {
    // Validates if the token is not corrupted
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    })
}

// TODO if the jwt working remote the session
// TODO fix the login proses
export const accessAdmin = [authToken /*, authRole(Role.ADMIN)*/ ,(req, res) => {
    console.log(req.user);
    res.send("Admin");
}];


