const usersApi = await import('../../api/usersApi.js');
const gamesApi = await import('../../api/gamesApi.js');

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
//         addMovePipe        //
////////////////////////////////

async function validatePlayer(req, res, next) {
    const { userId,accessServerKey,gameId, accessToken } = req.body;
    // check if accessToken is valid
    let isValid = await usersApi.profileTokenValidation({ profileId: userId, token: accessServerKey })
    if (!isValid) return res.status(401).send({ error: 'Invalid profileId or accessServerKey' });

    /* these checks are beeing done in addMove
    // check if accessToken is valid for this game
    isValid = await gamesApi.validateAccessToken({ accessKey:accessToken, gameId:gameId });
    if (!isValid) return res.status(401).send({ error: 'Invalid accessToken' });

    // check if userId is valid for this game
    isValid = await gamesApi.validatePlayerId({ userId:userId, gameId:gameId });
    if (!isValid) return res.status(401).send({ error: 'Invalid userId' });
    */
    next()
    return;
}

async function addMove(req, res, next) {
    const { userId, gameId, sqIDFrom, sqIDTo, accessToken } = req.body;
    // update the pgn for this game TODO
    const chessGame = await gamesApi.addMove({ userId:userId,gameId:gameId, sqIDFrom:sqIDFrom, sqIDTo:sqIDTo, accessToken:accessToken });

    // frontend expexts this response TODO
    // res: board, whiteIsPlaying, leagalMoves

    // update the fen for this game TODO
    return res.json({board:chessGame.fen, whiteIsPlaying:chessGame.whiteIsPlaying, leagalMoves:chessGame.leagalMoves});
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