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
    const { url , accessKey } = await gamesApi.createNewGame({ profileId:profileId });

    // return url and accessKey
    return res.status(200).send({ url, accessKey });
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

    // check if accessToken is valid for this game
    isValid = await gamesApi.validateAccessToken({ accessKey:accessToken, gameId:gameId });
    if (!isValid) return res.status(401).send({ error: 'Invalid accessToken' });

    // check if userId is valid for this game
    isValid = await gamesApi.validatePlayerId({ userId:userId, gameId:gameId });
    if (!isValid) return res.status(401).send({ error: 'Invalid userId' });

    next()
    return;
}

async function addMove(req, res, next) {
    const { userId, gameId, sqIDFrom, sqIDTo, accessToken } = req.body;
    // update the pgn for this game TODO

    // update the fen for this game TODO
    return res.status(200);
}

export const addMovePipe = [validatePlayer,addMove];

////////////////////////////////
//      getChessGamePipe      //
////////////////////////////////

async function getChessGame(req, res, next) {
    const chessGameId = req.params.id;
    const chessGame = await gamesApi.getChessGame({ chessGameId });
    return res.status(200).send(chessGame);
}
export const getChessGamePipe = [getChessGame];