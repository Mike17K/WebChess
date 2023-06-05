import { validateUser, addUser, deleteUser } from '../models/mysql/db_functions.mjs';
import { validateObj } from '../HelperFunctions/index.js';

const availableEngines = ['stockfish'];
const { controllers } = await import(`../controllers/index.js`);

// Routes Functions

// getLeagalMoves // url: /api/:enginename/getLeagalMoves/:fen
export async function getLeagalMoves(req, res) {
    if (!validateObj(req.params, ["enginename", "fen"])) return;
    const { enginename, fen } = req.params;
    if (!availableEngines.includes(enginename)) return res.json({ errorMessage: "Engine not supported" });
    const engineController = controllers[enginename];
    // get results
    const leagalMoves = await engineController.getLeagalMoves(fen);
    console.log("Sending Leagal Moves");
    // send results
    res.json({
        res: leagalMoves
    });
}


// testing 
export async function test(req, res) {
    console.log("test");
    res.json({
        res: "ok"
    });
}
