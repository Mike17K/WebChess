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

