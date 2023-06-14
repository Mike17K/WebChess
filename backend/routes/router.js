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
// /api/game/newGame -> returns secret code that is stored from client and when he calls /api/newGame/addMove sends this key for knowing in what game you are refering to
// /api/game/addMove

// 
// /api/game/:gameid -> returns the game requested in the desired format (TODO think about the format)
// /api/user/:userid -> returns the information about a user
// 
// /api/tactic/:tacticid -> retuns all the info about the tactic requested as fen,solution,explenation
router.get('/api/tactic/:tacticid', Api.getTactic);



// {engine api routes}
// /api/:enginename/info -> returns the info about the engine requested
// /api/:enginename/eval?fen=&&depth=
// /api/:enginename/topMoves?fen=&&depth=&&limit=
// 
// {general}
// /api/getLeagalMoves
router.post('/api/getLeagalMoves', Api.getLeagalMoves); // has to have a body with fen

// /api/:enginename/getEvaluation
router.post('/api/:enginename/getEvaluation', Api.getEvaluation); // has to have a body with fen





// testing
router.get('/api/test', Api.test);
