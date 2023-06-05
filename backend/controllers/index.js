import { validateObj } from '../HelperFunctions/index.js';

const stockfish = await import('./stockfishController.js');

// all controllers must have the functions bellow
// getLeagalMoves ,
const functions = ['getLeagalMoves', 'getEvaluation']

let controllers = {}
if (validateObj(stockfish, functions)) controllers = { ...controllers, 'stockfish': stockfish }

export { controllers };
