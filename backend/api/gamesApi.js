import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

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

    return {url:`http://localhost:3000/chessgame/${newGame.id}`,accessKey:newGame.accessKey};
}

export async function getChessGame({chessGameId}) {
    const chessGame = await prisma.chessGame.findFirst({
        where: {
            id: chessGameId,
        },
        include: {
            playerWhite: true,
            playerBlack: true,
        },
    });
    console.log("getChessGame res: ",chessGame);

    return { playerWhite:chessGame.playerWhite, playerBlack:chessGame.playerBlack, pgn:chessGame.pgn, status:chessGame.status, startTime: chessGame.startTime, whitePlayerTime:chessGame.whitePlayerTime, blackPlayerTime:chessGame.blackPlayerTime };
}

export async function validateAccessToken({accessKey, gameId}) {
    const chessGame = await prisma.chessGame.findFirst({
        where: {
            id: gameId,
        }
    });
    console.log("validateAccessToken res: ",chessGame);

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