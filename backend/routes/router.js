import express from 'express';

import {routerUsers} from './routerUsers/routerUsers.js';
import {routerGames} from './routerGames/routerGames.js';

export const router = express.Router(); // main router
const routerTactics = express.Router(); // all routes about tactics page

const piplines = await import('./piplines.js');
const Api = await import('../api/api.js');

// main api route
router.use('/api/users', routerUsers);
router.use('/api/tactic', routerTactics);
router.use('/api/game', routerGames);



// 
// /api/game/:gameid -> returns the game requested in the desired format (TODO think about the format)
// /api/user/:userid -> returns the information about a user
// 
// /api/tactic/:tacticid -> retuns all the info about the tactic requested as fen,solution,explenation
routerTactics.get('/id/:tacticid', Api.getTactic);
routerTactics.post('/addTactic', Api.addTactic); // /api/tactic/addTactic -> adds a tactic to the database // TODO only for admins make a pipline for admins // TODO change it to get req with data on headers

routerTactics.get('/getCategories', Api.getCategories); // /api/tactic/getCategories -> retuns all the categories of the tatics available
routerTactics.post('/getCategoryTactics', Api.getCategoryTactics); // has to contain a body with a titleCategory field // TODO change it to get req with data on headers



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
router.get('/api/testAccessAdmin', piplines.accessAdmin);
