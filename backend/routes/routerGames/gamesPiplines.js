const usersApi = await import('../../api/usersApi.js');
const gamesApi = await import('../../api/gamesApi.js');

const simpleEngine = await import('../../controllers/simpleEngineController.js');
import { fenToBoard} from '../../HelperFunctions/index.js';

////////////////////////////////
//         newGamePipe        //
////////////////////////////////

async function createNewGame(req, res, next) {
    // req {
    //  profileId: string
    //  accessServerKey: string
    // }

    // res {
    //  url: string
    //  chessGameAccessKey: string
    // }
    const profileId = req.headers['profileid'];
    const accessServerKey = req.headers['accessserverkey'];
    
    // check if profileId and accessServerKey are valid
    const isValid = await usersApi.profileTokenValidation({ profileId:profileId, token: accessServerKey })
    if (!isValid) return res.status(401).send({ error: 'Invalid profileId or accessServerKey' });

    // create new game
    const { url , accessKey, id } = await gamesApi.createNewGame({ profileId:profileId });

    // return url and accessKey
    return res.status(200).send({ url, accessKey,id });
}


export const newGamePipe = [createNewGame];

////////////////////////////////
//        joinGamePipe        //
////////////////////////////////

async function joinGame(req, res, next) {
    // req {
    //  profileId: string
    //  accessServerKey: string
    //  chessGameId: string
    // }

    const profileId = req.headers['profileid'];
    const accessServerKey = req.headers['accessserverkey'];
    const chessGameId = req.headers['chessgameid'];
    
    // check if profileId and accessServerKey are valid
    const isValid = await usersApi.profileTokenValidation({ profileId:profileId, token: accessServerKey })
    if (!isValid) return res.status(401).send({ error: 'Invalid profileId or accessServerKey' });

    // join new game
    const { url , accessKey, id, error } = await gamesApi.joinGame({ profileId:profileId, chessGameId:chessGameId });

    if(error) return res.status(400).send({ error: error });
    
    // return url and accessKey
    return res.status(200).send({ url, accessKey,id });
}


export const joinGamePipe = [joinGame];



////////////////////////////////
//         addMovePipe        //
////////////////////////////////

async function validatePlayer(req, res, next) {
    const { userId,accessServerKey,gameId, accessToken } = req.body;
    // check if accessToken is valid
    let isValid = await usersApi.profileTokenValidation({ profileId: userId, token: accessServerKey })
    if (!isValid){
        console.log("validatePlayer: ",isValid);
        return res.status(401).send({ error: 'Invalid profileId or accessServerKey', errorCode: 1});
    } 

    next()
    return;
}

async function addMove(req, res, next) {

    const { userId, gameId, sqIDFrom, sqIDTo, accessToken } = req.body;
    // update the pgn for this game TODO

    const response = await gamesApi.addMove({ userId:userId,gameId:gameId, sqIDFrom:sqIDFrom, sqIDTo:sqIDTo, accessToken:accessToken });
    if(response===400) return res.status(400).send({ error: 'Invalid move' });

    const { fen } = response;
    if(!fen) return res.status(400).send({ error: 'Invalid move' });
    // res: board, whiteIsPlaying, leagalMoves
    console.log("fen: ",fen);

    const leagalMoves = simpleEngine.getLeagalMoves(fen);
    const board = fenToBoard(fen);
    if(!board) return res.status(400).send({ error: 'Invalid fen' });

    // update the fen for this game TODO
    return res.json({board:board, whiteIsPlaying:fen.split(' ')[1] === 'w', leagalMoves:leagalMoves});
}

export const addMovePipe = [validatePlayer,addMove];

////////////////////////////////
//      getChessGamePipe      //
////////////////////////////////

async function getChessGame(req, res, next) {
    const chessGameId = req.params.id;
    const chessGame = await gamesApi.getChessGame({ chessGameId });
    console.log("getChessGame res: ",chessGame);
    return res.json(chessGame);
}
export const getChessGamePipe = [getChessGame];

////////////////////////////////
//      getPublicGamesPipe    //
////////////////////////////////

async function getPublicGames(req, res, next) {
    const publicGames = await gamesApi.getPublicGames();
    console.log("getPublicGames res: ",publicGames);
    return res.json(publicGames);
}

export const getPublicGamesPipe = [getPublicGames];