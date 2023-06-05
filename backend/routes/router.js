import express from 'express';
export const router = express.Router();
import {
    signin,
    signup,
    logout,
    loginPipe,
    registerPipe
} from './piplines.js';

const Api = await import('../api/api.js');


// routes

// /api/addUser
// /api/delUser
// /api/updateUser
// 
// {logged in}
// /api/newGame/ -> returns secret code that is stored from client and when he calls /api/newGame/addMove sends this key for knowing in what game you are refering to
// /api/newGame/addMove?gameKey=
// 
// /api/game/:gameid -> returns the game requested in the desired format (TODO think about the format)
// /api/user/:userid -> returns the information about a user
// 
// /api/tactic/:tacticid -> retuns all the info about the tactic requested as fen,solution,explenation
// 
// {engine api routes}
// /api/:enginename/info -> returns the info about the engine requested
// /api/:enginename/eval?fen=&&depth=
// /api/:enginename/topMoves?fen=&&depth=&&limit=
// 
// {general}
// /api/:enginename/getLeagalMoves/:fen
router.get('/api/:enginename/getLeagalMoves/:fen', Api.getLeagalMoves);

// /api/:enginename/getEvaluation/:fen
router.get('/api/:enginename/getEvaluation/:fen', Api.getEvaluation);





// testing
router.get('/api/test', Api.test);
