import crypto from 'crypto';
import jwt_decode from "jwt-decode";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const usersApi = await import('../../api/usersApi.js');

////////////////////////////////
//      getMyProfilePipe      //
////////////////////////////////

export async function validateAccessKey(profileId, token, callback) {
    if (!profileId) return;

    // check if there is this token in the userId
    const isValid = await usersApi.profileTokenValidation({ profileId: profileId, token: token }).catch(err => console.log(err));

    if (!isValid) return;  // tell the client that there is a server error with the accesskey
    callback();
}

async function sendProfile(req, res) {
    const profileId = req.params.profileId;

    // get user data
    const userProfile = await usersApi.getProfile({ profileId: profileId, userMode: "OWNER" }).catch(err => console.log(err));
    
    // send user data
    res.json(userProfile);
}

export const getMyProfilePipe = [(req, res, next) => validateAccessKey(req.params.profileId, req.headers['access_server_key'], next), sendProfile];


////////////////////////////////
//      deleteTokenPipe      //
////////////////////////////////

async function deleteToken(req, res) {
    const token = req.headers['token'];
    const userId = req.headers['userid'];

    if (!userId || !token) return res.sendStatus(400);

    const user = await usersApi.findUser({ where: { id: userId }, });
    if (!user) return res.sendStatus(400);
    // remove token from auth provider // TODO test if works fine
    let response = null;
    if (user.authProvider === "Google") {
        response = await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => response.json()).catch(err => console.log(err));
    } else if (user.authProvider === "Github") {
        response = await fetch(`https://api.github.com/applications/${process.env.GITHUB_CLIENT_ID}/token`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-GitHub-Api-Version': '2022-11-28'
            }
        }).then(response => response.json()).catch(err => console.log(err));
    } else if (user.authProvider === "Discord") {
        response = await fetch(`https://discord.com/api/v10/oauth2/token/revoke`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                token: token,
            }),
        }).then(response => response.json()).catch(err => console.log(err));
    }

    console.log("Logout response: ", response);

    // remove token from database
    const status = await usersApi.deleteToken(userId, token);
    res.sendStatus(status);
}

export const deleteTokenPipe = [(req, res, next) => validateAccessKey(req.headers['userid'], req.headers['token'], next), deleteToken];

////////////////////////////////
//       getTokenPipe        //
////////////////////////////////
async function googleHandler(req, res, next) {
    const code = req.headers['code'];
    if (!code) return res.sendStatus(500); // here we had error if code == undefined its not exitig
    
    const decoded_data = jwt_decode(code);
    const { email, aud, iss } = decoded_data;
    if (!email || !aud || !iss) return res.sendStatus(500);
    
    if (iss !== 'https://accounts.google.com') return res.sendStatus(400); // validate iss
    
    // serch in database for account with this email and id of aud
    const user = await usersApi.findUser({
        where: {
            AND: [
                { aud: aud },
                { authProvider: "Google" },
            ],
        },
        include: {
            profile: true
        },
    }).catch(err => console.log(err));
    
    console.log("googleHandler",user,aud);

    if (!user) return res.sendStatus(500);
    if (user.profile.email !== email) return res.sendStatus(500);

    req.userId = user.id;
    next();
}
async function discordHandler(req, res, next) {
    const code = req.headers['code'];
    if (!code) return res.sendStatus(500);
    // validating the code
    const response = await fetch(`https://discord.com/api/v10/users/@me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${code}`
        }
    }).then(response => response.json()).catch(err => console.log(err));
    
    if (response.message === 'Bad credentials') {
        return res.sendStatus(500);
    }

    const { id, username } = response;
    if (!id || !username) return res.sendStatus(500);

    // serch in database for account with this email and id of aud
    const user = await usersApi.findUser({ where: { AND: [{ id: id }, { name: username }, { authProvider: "Discord" }], }, }).catch(err => console.log(err));

    if (!user) return res.sendStatus(500);

    req.userId = user.id;

    next();
}
async function githubHandler(req, res, next) {
    const code = req.headers['code'];
    if (!code) return res.sendStatus(500);
    // validating the code
    const response = await fetch(`https://api.github.com/user`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${code}`
        }
    }).then(response => response.json()).catch(err => console.log(err));

    if (response.message === 'Bad credentials') {
        return res.sendStatus(500)
    }
    const { name, node_id } = response;
    if (!name || !node_id) return res.sendStatus(500);

    // serch in database for account with this email and id of aud
    const user = await usersApi.findUser({ where: { AND: [{ name: name }, { aud: node_id }, { authProvider: "Github" }], }, }).catch(err => console.log(err));

    if (!user) return res.sendStatus(500);

    req.userId = user.id;

    next();
}

async function customFormHandler(req, res, next) {
    let name;
    let password;
    try {
        const jsonData = JSON.parse(req.headers['code']);
        name = jsonData.name;
        password = jsonData.password;
    } catch (err) {
        return res.sendStatus(500);
    }

    if (!name || !password) return res.sendStatus(500);

    // regex test the name and password
    const nameRegex = /^[A-Za-z0-9]+$/;
    const passwordRegex = /^[A-Za-z0-9]+$/;

    const isNameValid = nameRegex.test(name);
    const isPasswordValid = passwordRegex.test(password);

    if (!isNameValid || !isPasswordValid) {
        // Invalid name or password, handle the error or send an appropriate response
        return res.sendStatus(400); // Bad Request
    }

    //find user with this name 
    const user = await usersApi.findUser({ where: { AND: [{ username: name }, { authProvider: "CustomForm" }], }, }).catch(err => console.log(err));
    if (!user) return res.sendStatus(500);
    if (!user.salt) return res.sendStatus(500);

    // Hash the password
    const hash = crypto.createHash('sha256');
    hash.update(password + user.salt);
    const hashedEnteredPassword = hash.digest('hex');

    // check if the password is correct
    if (user.password !== hashedEnteredPassword) return res.sendStatus(500);

    req.userId = user.id;

    next();
}

async function checkTokenWithProvider(req, res, next) {
    const provider = req.headers['provider'];

    if (provider === "Google") {
        googleHandler(req, res, next);
        return
    } else if (provider === "Discord") {
        discordHandler(req, res, next)
        return
    } else if (provider === "Github") {
        githubHandler(req, res, next)
        return
    } else if (provider === "CustomForm") {
        customFormHandler(req, res, next)
        return
    }

}

/*
function generateAccessToken(user) {
    return jwt.sign({ name: user.name, userId: user.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
}
jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        console.log(token)
        req.user = user;
        next();
    })
    */

async function generateToken(req, res) {
    const access_server_key = crypto.randomBytes(64).toString('hex');
    const ttl = 2000*1000; // 2000 seconds = 33 minutes
    const userId = req.userId;
    const status = await usersApi.setToken(userId, access_server_key, ttl,"ACCESS");

    const refresh_token = crypto.randomBytes(64).toString('hex');
    const ttl_refresh = 1000000 * 1000; // 1000000 seconds = 11 days
    const status_refresh = await usersApi.setToken(userId, refresh_token, ttl_refresh,"REFRESH");

    if (status && status_refresh) {
        console.log({ access_server_key: access_server_key, refresh_token:refresh_token, ttl: ttl, userId: userId });
        res.json({ access_server_key: access_server_key,refresh_token:refresh_token, ttl: ttl, userId: userId });
        return;
    }
    res.sendStatus(400);
}

export const getTokenPipe = [checkTokenWithProvider, generateToken];

////////////////////////////////
// refreshAccessServerKeyPipe //
////////////////////////////////

async function isRefreshTokenValid(req, res, next) {
    // is post request
    const userId = req.body['userId'];
    const refresh_token = req.body['refresh_token'];

    if (!userId || !refresh_token) return res.sendStatus(400);

    const user = await usersApi.findUser({ where: { id: userId }, 
        include: { accessTokens: { where: { token: refresh_token } } }
    }).catch(err => console.log(err));

    if (!user) return res.sendStatus(400);
    // check if token is expired

    const isExpired = user.accessTokens[0].expired < new Date();
    const token_type = user.accessTokens[0].type;
    console.log("Refresh token is expred: ",isExpired);

    if (isExpired || token_type !== "REFRESH") return res.sendStatus(400);

    next();
}

async function updateAccessServerKey(req, res) {
    const access_server_key = crypto.randomBytes(64).toString('hex');
    const ttl = 2000*1000; // 2000 seconds = 33 minutes
    const userId = req.body['userId'];
    const status = await usersApi.setToken(userId, access_server_key, ttl,"ACCESS");

    if (status) {
        console.log({ access_server_key: access_server_key, ttl: ttl });
        res.json({ access_server_key: access_server_key, ttl: ttl});
        return;
    }
    res.sendStatus(400);
}

export const refreshAccessServerKeyPipe = [isRefreshTokenValid, updateAccessServerKey];

////////////////////////////////
//       createUserPipe       //
////////////////////////////////
async function googleHandlerRegister(req, res, next) {
    const code = req.body['code'];
    if (!code) return res.sendStatus(500); // here we had error if code == undefined its not exitig

    const decoded_data = jwt_decode(code);
    const { email, aud, iss } = decoded_data;
    console.log(decoded_data);
    if (!email || !aud || !iss) return res.sendStatus(500);

    if (iss !== 'https://accounts.google.com') return res.sendStatus(400); // validate iss

    // serch in database for account with this email and id of aud
    const user = await usersApi.findUser({
        where: {
            AND: [
                { aud: aud },
                { authProvider: "Google" },
            ],
        },
        include: {
            profile: true
        },
    }).catch(err => console.log(err));

    if (user) return res.sendStatus(500, "User already exist");
    // create new user
    // create new profile
    
    // TODO same username issue
    console.log("create user: aud: ",aud);
    const newUser = await usersApi.createFullUser({
        username: decoded_data.email,
        password: "GOOGLE",
        authProvider: "Google",
        aud: aud,
        profile: {
            create: {
                profilename: decoded_data.name,
                email: decoded_data.email,
                picture: decoded_data.picture,                  
            }
        }
    }).catch(err => console.log(err));
    
    
    if (!newUser) return res.sendStatus(500);
    
    return res.sendStatus(200);
}

async function discordHandlerRegister(req, res, next) {    
    const code = req.body['code'];
    if (!code) return res.sendStatus(500);
    // validating the code
    const response = await fetch(`https://discord.com/api/v10/users/@me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${code}`
        }
    }).then(response => response.json()).catch(err => console.log(err));
    
    if (response.message === 'Bad credentials') {
        return res.sendStatus(500);
    }
    console.log("Discord register",response,code); // find out why the discord is not working TODO
    
    const { id, username } = response;
    if (!id || !username) return res.sendStatus(500);
    
    // serch in database for account with this email and id of aud
    const user = await usersApi.findUser({ where: { AND: [{ id: id }, { name: username }, { authProvider: "Discord" }], }, }).catch(err => console.log(err));
    
    if (user) return res.sendStatus(500, "User already exist");
    
    

    // create new user TODO
    // create new profile TODO
    console.log("create user: id: ",response);
    // TODO same username issue
    // console.log("create user: aud: ",aud);
    // const newUser = await usersApi.createFullUser({
    //     username: decoded_data.email,
    //     password: "GOOGLE",
    //     authProvider: "Google",
    //     aud: aud,
    //     profile: {
    //         create: {
    //             profilename: decoded_data.name,
    //             email: decoded_data.email,
    //             picture: decoded_data.picture,                  
    //         }
    //     }
    // }).catch(err => console.log(err));
    

    // if (!newUser) return res.sendStatus(500);
    
    // return res.sendStatus(200);
}

async function githubHandlerRegister(req, res, next) {
    const code = req.body['code'];
    if (!code) return res.sendStatus(500);
    // validating the code
    const response = await fetch(`https://api.github.com/user`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${code}`
        }
    }).then(response => response.json()).catch(err => console.log(err));

    if (response.message === 'Bad credentials') {
        return res.sendStatus(500)
    }
    console.log("Github register",response,code);
    const { name, node_id } = response;
    if (!name || !node_id) return res.sendStatus(500);

    // serch in database for account with this email and id of aud
    const user = await usersApi.findUser({ where: { AND: [{ name: name }, { aud: node_id }, { authProvider: "Github" }], }, }).catch(err => console.log(err));

    if (user) return res.sendStatus(500);

    // create new user TODO
    // create new profile TODO

}

async function customFormHandlerRegister(req, res, next) {
    let name;
    let password;
    console.log("ok");
    try {
        name = req.body.name;
        password = req.body.password;
    } catch (err) {
        return res.sendStatus(500);
    }

    if (!name || !password) return res.sendStatus(500);

    // regex test the name and password
    const nameRegex = /^[A-Za-z0-9]+$/;
    const passwordRegex = /^[A-Za-z0-9]+$/;

    const isNameValid = nameRegex.test(name);
    const isPasswordValid = passwordRegex.test(password);

    if (!isNameValid || !isPasswordValid) {
        // Invalid name or password, handle the error or send an appropriate response
        return res.sendStatus(500); // Bad Request
    }

    //find user with this name
    const user = await usersApi.findUser({ where: { AND: [{ username: name }], }, }).catch(err => console.log(err));
    if (user) return res.sendStatus(500);

    // register password encryption
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256');
    hash.update(password + salt);
    const hashedEnteredPassword = hash.digest('hex');
    // store the user in the database

    const newUser = await usersApi.createUser({ username: name, password: hashedEnteredPassword, salt: salt, authProvider: "CustomForm" }).catch(err => console.log(err));

    // make user profile
    const newProfile = await usersApi.createProfile({ profilename: name, userId: newUser.id }).catch(err => console.log(err));

    if (!newUser) return res.sendStatus(500);
    if (!newProfile) return res.sendStatus(500);

    res.sendStatus(200);
}

function createUserFromProviderRegister(req, res, next) {
    const provider = req.body['provider'];

    if (provider === "Google") {
        googleHandlerRegister(req, res, next);
        return
    } else if (provider === "Discord") {
        // TODO
        discordHandlerRegister(req, res, next)
        return
    } else if (provider === "Github") {
        // TODO
        githubHandlerRegister(req, res, next)
        return
    } else if (provider === "CustomForm") {
        customFormHandlerRegister(req, res, next)
        return
    }
}

export const createUserPipe = [createUserFromProviderRegister];