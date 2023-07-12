import express from 'express';

// all routes about users
export const routerUsers = express.Router();

const userPiplines = await import('./usersPiplines.js');

// auth routes
// User Routes after: /api/users

//routerUsers.get('/profile/:profileId', userPiplines.getMyProfilePipe); // TODO GENERAL get profile
routerUsers.get('/profile/:profileId/me', userPiplines.getMyProfilePipe); // headers: {'access_server_key': access_server_key}

routerUsers.delete('/token', userPiplines.deleteTokenPipe); //headers: {'token': , 'profileId': }
routerUsers.get('/token', userPiplines.getTokenPipe); //headers: {'token': response.credential,"provider":"google"} 

routerUsers.post('/createUser', userPiplines.createUserPipe); // body: {'code': response.credential ???? ,"provider":"google"} TODO


// routes
// /admin
// router.get('/admin', userPiplines.adminPipe);??????????

// /api/addUser
// /api/delUser
// /api/updateUser
// 

