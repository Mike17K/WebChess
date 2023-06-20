import express from 'express';

// all routes about users
export const routerUsers = express.Router(); 

const userPiplines = await import('./usersPiplines.js');
const userOLDDDDDDDPiplines = await import('../piplines.js');

// auth routes
// User Routes after: /api/users
// - routerUsers.post('/login', userPiplines.loginPipe);

//routerUsers.get('/profile/:profileId', userPiplines.getMyProfilePipe); // TODO GENERAL get profile
routerUsers.get('/profile/:profileId/me', userPiplines.getMyProfilePipe); // TODO headers: {'access_server_key': access_server_key}

routerUsers.delete('/token', userPiplines.deleteTokenPipe); //headers: {'token': , 'profileId': } TODO
routerUsers.get('/token', userPiplines.getTokenPipe); //headers: {'token': response.credential,"provider":"google"} TODO



//routerUsers.get('/auth/:provider/redirect', userPiplines.discordRedirect);

routerUsers.all('/auth/discord/redirect', userOLDDDDDDDPiplines.discordRedirect); // TODO make them like google login process new process
routerUsers.get('/auth/github/redirect', userOLDDDDDDDPiplines.githubRedirect);// TODO make them like google login process new process

routerUsers.all('/auth/discord/logout', userOLDDDDDDDPiplines.discordLogout);// TODO make them like google login process new process
routerUsers.all('/auth/github/logout', userOLDDDDDDDPiplines.githubLogout);// TODO make them like google login process new process


// routes
// /admin
// router.get('/admin', userPiplines.adminPipe);??????????

// /api/addUser
// /api/delUser
// /api/updateUser
// 

