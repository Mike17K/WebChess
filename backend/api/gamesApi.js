import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const simpleEngine = await import('../controllers/simpleEngineController.js');

const prisma = new PrismaClient(
  {
   // log: ['query', 'info', 'warn'],
   
  }
);

prisma.$connect()



export async function createNewGame({profileId}) {
    const newGame = await prisma.chessGame.create({
        data: {
            playerWhite: {
                connect: { id: profileId } // Replace "white-player-id" with the actual ID of the white player
              },
              playerBlack: undefined,
        whitePlayerTime: 3600000,
        blackPlayerTime: 3600000,
        pgn: '',
        status: 'WAITING_FOR_PLAYER',
        startTime: new Date(),
        accessKey: crypto.randomBytes(16).toString('hex'),
        },
    });

    return {id:newGame.id,url:`http://localhost:3000/chessgame/${newGame.id}`,accessKey:newGame.accessKey};
}

export async function getChessGame({chessGameId}) {
    const chessGame = await prisma.chessGame.findFirst({
        where: {
          id: chessGameId,
        },
        include: {
          playerWhite: {
            select: {
              id: true,
              profile: {
                select: {
                  profilename: true,
                  picture: true,
                  email: true,
                  rating: true,
                },
              },
            },
          },
          playerBlack: {
            select: {
              id: true,
              profile: {
                select: {
                  profilename: true,
                  picture: true,
                  email: true,
                  rating: true,
                },
              },
            },
          },
        },
      });
      
    if (chessGame === null) return {};
    return { fen:chessGame.fen,playerWhite:chessGame.playerWhite, playerBlack:chessGame.playerBlack, pgn:chessGame.pgn, status:chessGame.status, startTime: chessGame.startTime, whitePlayerTime:chessGame.whitePlayerTime, blackPlayerTime:chessGame.blackPlayerTime };
}

export async function validateAccessToken({accessKey, gameId}) {
    const chessGame = await prisma.chessGame.findFirst({
        where: {
            id: gameId,
        }
    });

    if(chessGame.accessKey === accessKey) return true;
    return false;
}

export async function validatePlayerId({ userId,gameId}){
    const chessGame = await prisma.chessGame.findFirst({
        where: {
            id: gameId,
        }
    });
    console.log("validatePlayerId res: ",chessGame);

    if(chessGame.playerWhiteId === userId || chessGame.playerBlackId === userId) return true;
    return false;
}

export async function addMove({ userId,gameId, sqIDFrom, sqIDTo, accessToken }) {
    const chessGame = await prisma.chessGame.findFirst({
        where: {
            id: gameId,
        }
    });
    if(chessGame.accessKey !== accessToken) return 400;
    if(chessGame.playerWhiteId === userId || chessGame.playerBlackId === userId){
        // get fen and send the move to the engine with sqIDFrom and sqIDTo TODO

        const {fen} = simpleEngine.move(chessGame.fen,sqIDFrom,sqIDTo);

        // TODO update database
        // it will return the fen after the move TODO
        
        // update the fen for this game TODO
        // update the pgn for this game TODO
        // const res = await prisma.chessGame.update({
        //     where: { id: gameId },
        //     data: { pgn: chessGame.pgn + ' ' + sqIDFrom + sqIDTo },
        //   })
        
        return { fen:fen };
    }
    return 400;
}