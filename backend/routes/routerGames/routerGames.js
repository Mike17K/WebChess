import express from 'express';

// all routes about games
export const routerGames = express.Router();

const gamesPiplines = await import('./gamesPiplines.js');

routerGames.get('/newGame', gamesPiplines.newGamePipe); // headers:profileId, accessServerKey will return a url to redirect to and a secret code to store in the client
routerGames.post('/addMove', gamesPiplines.addMovePipe); //userId,gameId,sqIDFrom,sqIDTo,accessToken ib body
routerGames.get('/getChessGame/:id', gamesPiplines.getChessGamePipe); 
routerGames.get('/publicGames', gamesPiplines.getPublicGamesPipe);

