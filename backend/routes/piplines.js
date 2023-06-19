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
        console.log(token)
        req.user = user;
        next();
    })
}

export function logout(req, res) {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
}

const DISCORD_ENDPOINT = 'https://discord.com/api/v10';
export async function discordRedirect(req, res) {
    // got the code in req.query.code
    const code = req.query.code;

    // we need to exchange it with an access token
    const body = `client_id=${process.env.DISCORD_CLIENT_ID}&client_secret=${process.env.DISCORD_CLIENT_SECRET}&grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:5050/api/users/auth/discord/redirect`;
    const response = await fetch(`${DISCORD_ENDPOINT}/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    }).catch(err => {
        console.log(err);
        res.sendStatus(400);
    });
    
    const tokenResponse = await response.json();
    res.redirect(`http://localhost:3000/login?access_token=${tokenResponse.access_token}&&refresh_token=${tokenResponse.refresh_token}`)
  }

  export async function discordLogout(req, res) {
    const token = req.headers['token'];
    console.log(token);
  
    fetch(`${DISCORD_ENDPOINT}/oauth2/token/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        token: token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (Object.keys(data).length === 0) {
          res.sendStatus(200);
        } else {
          res.sendStatus(400);
        }
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(405);
      });
  }

  export async function githubRedirect(req,res){
     // The req.query object has the query params that were sent to this route.
    const requestToken = req.query.code

    fetch(`https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${requestToken}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      const access_token = data.access_token;
      res.redirect(`http://localhost:3000/login?github_access_token=${access_token}`)
    })
    .catch(error => {
      console.error(error);
    });

  }
  
  export async function githubLogout(req, res) {
    const token = req.headers['token'];

    fetch(`https://api.github.com/applications/${process.env.GITHUB_CLIENT_ID}/token`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
 })
    .then(response => {
    if (response.status === 204) {
        console.log('Access token revoked successfully.');
        res.sendStatus(200);
    } else {
        console.error('Failed to revoke access token.');
    }
    })
    .catch(error => {
    console.error('Error occurred during access token revocation:', error);
    });


  }

// TODO if the jwt working remote the session
// TODO fix the login proses
export const accessAdmin = [authToken /*, authRole(Role.ADMIN)*/ ,(req, res) => {
    console.log(req.user);
    res.send("Admin");
}];


