import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
prisma.$connect()

const refreshTokens = []

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

    const userData = await prisma.user.findUnique({where: {email: email},select: {id: true,name: true,password: true}});
  
    // check if user exists
    if (userData.id == null) return res.sendStatus(403);
    // check if username and password are correct
    if (username !== userData.name) return res.sendStatus(403);
    if (password !== userData.password) return res.sendStatus(403);
    
    // this field defines what info its going to be stored in the token
    const user = { name: username, userId: userData.id }; 

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET); 
    refreshTokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
}

export async function refreshToken(req, res) {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken(user);
        res.json({ accessToken: accessToken });
    })
}

function generateAccessToken(user) {
    return jwt.sign({ name: user.name, userId: user.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
}

export const loginPipe = [authUser];

function authToken(req, res, next) {// Validates if the token is not corrupted
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

export function logout(req, res) {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
}

// TODO if the jwt working remote the session
// TODO fix the login proses
export const accessAdmin = [authToken /*, authRole(Role.ADMIN)*/ ,(req, res) => {
    console.log(req.user);
    res.send("Admin");
}];


