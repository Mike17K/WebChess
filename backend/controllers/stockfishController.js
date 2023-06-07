// Stockfish Controller 
import Stockfish from 'stockfish'

/*
"compiler",
"d",
"eval",
"exit",
"flip",
"go ",
"isready ",
"ponderhit ",
"position fen ",
"position startpos",
"position startpos moves",
"quit",
"setoption name Clear Hash value true",
"setoption name Contempt value ",
"setoption name Hash value ",
"setoption name Minimum Thinking Time value ",
"setoption name Move Overhead value ",
"setoption name MultiPV value ",
"setoption name Ponder value ",
//"setoption name Skill Level Maximum Error value ",
//"setoption name Skill Level Probability value ",
"setoption name Skill Level value ",
"setoption name Slow Mover value ",
"setoption name Threads value ",
"setoption name UCI_Chess960 value false",
"setoption name UCI_Chess960 value true",
"setoption name UCI_AnalyseMode value true",
"setoption name UCI_AnalyseMode value false",
"setoption name UCI_LimitStrength value true",
"setoption name UCI_LimitStrength value false",
"setoption name UCI_Elo value ",
"setoption name UCI_ShowWDL value true",
"setoption name UCI_ShowWDL value false",
"setoption name Use NNUE value true",
"setoption name Use NNUE value false",
"setoption name nodestime value ",
"setoption name EvalFile value ",
"stop",
"uci",
"ucinewgame"
];
var completionsMid = [
"binc ",
"btime ",
"confidence ",
"depth ",
"infinite ",
"mate ",
"maxdepth ",
"maxtime ",
"mindepth ",
"mintime ",
"moves ", /// for position fen ... moves
"movestogo ",
"movetime ",
"ponder ",
"searchmoves ",
"shallow ",
"winc ",
"wtime "
*/

const stockfish = new Stockfish();
// stockfish.postMessage("setoption name Skill Level value 20");
stockfish.onMessage = (event) => {
    console.log("Stockfish says: " + event);
};

stockfish.onMessage = (event) => {
    if (event === 'Stockfish.js ready') {
        // Stockfish engine is ready, you can now use postMessage
        stockfish.postMessage("setoption name Skill Level value 20");
    }
};

// stockfish.postMessage("position startpos");
// stockfish.postMessage("go movetime 1000");

// engine.onmessage = (data) => {
//     console.log(data)
//     data = data + ''
//     if (data.startsWith('Fen:')) {
//         fen = data.split(':')[1].trim()
//         const curTurn = data.split(' ')[2]
//     }
//     if (data == 'info depth 0 score mate 0') {
//         console.log('win!');
//     }
// }


export async function getLeagalMoves(fen) {
    return 1; //TODO implementation
}

export async function getEvaluation(fen) {
    return 1; //TODO implementation
}


