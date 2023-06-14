import { validateUser, addUser, deleteUser } from '../models/mysql/db_functions.mjs';
import { validateObj } from '../HelperFunctions/index.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

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
    // send results
    res.json({
        evaluation: evaluation
    });
}

// /api/tactic/:tacticid -> retuns all the info about the tactic requested as fen,solution,explenation
export async function getTactic(req, res) {
    const { tacticid } = req.params;
    // TODO get results from db
    const tactic = {
        fen: "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 0 1",
        hints: "7...Q",
        title: "Diagram 1",
        titleCategory: "B20 - 1.e4 c5",
        tacticInfo: "Simons - Lowe, London 1849",
        solution: "7...Qa5+ 0-1",
        comments: "Black checks to capture the undefended bishop.",
        isWhiteTurn: false,
      };
    // send results
    res.json({
        tactic: tactic
    });  
}

// /api/tactic/:titleCategory/getTactics -> retuns all the tactics in the category
export async function getCategoryTactics(req, res) {
    const { titleCategory } = req.body;
    // TODO get results from db
    const tactics =  [            
        {titleCategory:titleCategory,title:'Diagram 1',endpoint:"/api/tactic/id/0005557568"},
        {titleCategory:titleCategory,title:'Diagram 2',endpoint:"/api/tactic/id/4842248455"},
        {titleCategory:titleCategory,title:'Diagram 2',endpoint:"/api/tactic/id/4827248455"},
        {titleCategory:titleCategory,title:'Diagram 2',endpoint:"/api/tactic/id/0482248415"},
        {titleCategory:titleCategory,title:'Diagram 2',endpoint:"/api/tactic/id/0482248425"},
        {titleCategory:titleCategory,title:'Diagram 2',endpoint:"/api/tactic/id/0482248435"},
        {titleCategory:titleCategory,title:'Diagram 2',endpoint:"/api/tactic/id/04822484345"},
        {titleCategory:titleCategory,title:'Diagram 2',endpoint:"/api/tactic/id/0482248457"},
        {titleCategory:titleCategory,title:'Diagram 2',endpoint:"/api/tactic/id/0482248458"},
        {titleCategory:titleCategory,title:'Diagram 2',endpoint:"/api/tactic/id/0482248456"},
        {titleCategory:titleCategory,title:'Diagram 2',endpoint:"/api/tactic/id/0482248455"},
        {titleCategory:titleCategory,title:'Diagram 2',endpoint:"/api/tactic/id/0482248459"},
    ]
    // send results
    res.json({
        tactics: tactics
    });
}

// /api/tactic/getCategories -> retuns all the categories of the tatics available
export async function getCategories(req, res) {
    // TODO get results from db
    const categories = [
        {uid:"5688562418",name:"B20 - 1.e4 c5"},
        {uid:"5456785136",name:"B21 - 2.f4"},
        {uid:"5456745436",name:"B22 - 2.c3 d5"}
    ];
    // send results
    res.json({
        categories: categories
    });
}


// testing 
export async function test(req, res) {
    console.log("test");
    res.json({
        res: "ok"
    });
}
