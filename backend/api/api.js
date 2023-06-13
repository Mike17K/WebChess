import { validateUser, addUser, deleteUser } from '../models/mysql/db_functions.mjs';
import { validateObj } from '../HelperFunctions/index.js';

const availableEngines = ['stockfish'];
const { controllers } = await import(`../controllers/index.js`);

// Routes Functions

// getLeagalMoves // url: /api/getLeagalMoves has to have a body with fen
export async function getLeagalMoves(req, res) {
    const enginename = "simpleEngine"
    const engineController = controllers[enginename];
    if(req.body.fen === undefined) return res.json({ errorMessage: "fen not provided" } );
    // get results
    const leagalMoves = await engineController.getLeagalMoves(req.body.fen);
    console.log("Sending Leagal Moves");
    // send results
    res.json({
        leagalMoves: leagalMoves
    });
}

// getEvaluation // url: /api/:enginename/getEvaluation has to have a body with fen
export async function getEvaluation(req, res) {
    if (!validateObj(req.params, ["enginename"])) return;
    const { enginename } = req.params;
    if (!availableEngines.includes(enginename)) return res.json({ errorMessage: "Engine not supported" });
    const engineController = controllers[enginename];
    if(req.body.fen === undefined) return res.json({ errorMessage: "fen not provided" } );
    // get results
    const evaluation = await engineController.getEvaluation(req.body.fen);
    console.log("Sending Leagal Moves");
    // send results
    res.json({
        evaluation: evaluation
    });
}


// testing 
export async function test(req, res) {
    console.log("test");
    res.json({
        res: "ok"
    });
}
