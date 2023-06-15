import { validateObj } from '../HelperFunctions/index.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
prisma.$connect()

const availableEngines = ['stockfish'];
const { controllers } = await import(`../controllers/index.js`);

// Routes Functions

// getLeagalMoves // url: /api/getLeagalMoves has to have a body with fen
export async function getLeagalMoves(req, res) {
    const enginename = "simpleEngine"
    const engineController = controllers[enginename];
    if(req.body.fen === undefined) return res.json({ errorMessage: "fen not provided" } );
    // TODO check if fen is valid
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
    const tactic = await prisma.tactic.findUnique({
        where: {
            id: tacticid,
        },
    })

    // send results
    res.json({
        tactic: tactic
    });  
}

// /api/tactic/addTactic -> adds a tactic to the database
export async function addTactic(req, res) {
    // validate inputs
    if (!validateObj(req.body, ["title","titleCategory","fen","hints","tacticInfo","solution","comments"])) return res.json({ errorMessage: 'Not all fields provided: ["title","titleCategory","fen","hints","tacticInfo","solution","comments"]'});
    // get data 
    const { title,titleCategory,fen,hints,tacticInfo,solution,comments } = req.body;
    // submit data
    const tactic = await prisma.tactic.create({
        data: {
            title: title,
            titleCategory:titleCategory,
            fen:fen,
            hints:hints,
            tacticInfo:tacticInfo,
            solution:solution,
            comments:comments
        },
    }).then(() => {
        // send results
        res.json({
            res: "ok"
        });
    }).catch((err) => {
        return res.json({ errorMessage: 'Error adding tactic to database'+err });
    })

}

// /api/tactic/:titleCategory/getTactics -> retuns all the tactics in the category
export async function getCategoryTactics(req, res) {
    const { titleCategory } = req.body;
    const tactics = await prisma.tactic.findMany({
        where: {
            titleCategory: titleCategory,
        },
    })

    // send results
    res.json({
        tactics: tactics
    });
}

// /api/tactic/getCategories -> retuns all the categories of the tatics available
export async function getCategories(req, res) {
    const categories = await prisma.category.findMany();
    // send results
    res.json({
        categories: categories
    });
}


// testing 
export async function test(req, res) {
    console.log("test");
    
    /*
    // add categories
    const categories = [
        {id:"5688562418",name:"B20 - 1.e4 c5"},
        {id:"5456785136",name:"B21 - 2.f4"},
        {id:"5456745436",name:"B22 - 2.c3 d5"}
    ];
    let response=[];
    for (const category of categories) {
        const cat = await prisma.category.create({
            data: {
                id: category.id,
                name: category.name,
            },
        })
        response.push(cat);
    }
    
    res.json({
        res: response
    });
    
    // add tactic
    const tactic = await prisma.tactic.create({
        data: {
            fen: "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 0 1",
            hints: "7...Q",
            title: "Diagram 1",
            titleCategory: "B20 - 1.e4 c5",
            tacticInfo: "Simons - Lowe, London 1849",
            solution: "7...Qa5+ 0-1",
            comments: "Black checks to capture the undefended bishop.",
        },
    })
    console.log("Added");
    console.log(tactic);
    */
}
