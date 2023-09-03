import { validateObj } from '../HelperFunctions/index.js';

const stockfish = await import('./stockfishController.js');
const simpleEngine = await import('./simpleEngineController.js');

// all controllers must have the functions bellow
// getLeagalMoves ,

const functions = ['getLeagalMoves', 'getEvaluation']

let controllers = {}
if (validateObj(stockfish, functions)) controllers = { ...controllers, 'stockfish': stockfish }
if (validateObj(simpleEngine, functions)) controllers = { ...controllers, 'simpleEngine': simpleEngine }

export { controllers };
