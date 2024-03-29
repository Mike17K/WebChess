import { fenToBoard, boardToFen,showBoard } from '../HelperFunctions/index.js';

const sqName = (id) =>{return `${['a','b','c','d','e','f','g','h'][id%8]}${Math.floor(id/8)+1}`;}; // input 0 output "a1"
const sqId = (name) =>{return ['a','b','c','d','e','f','g','h'].indexOf(name[0])*8+parseInt(name[1])-1;}; // input "a1" output 0

// TODO fix the check !!

// posible moves semi-legal
function generateMoves_Pawn(piecePos,board,fen){
    // piecePos = 0-63
    // board = array of 64 chars
    const pieceColor = board[piecePos][0];
    const moves = [];
    const directions = pieceColor === 'w' ? [8,16,7,9] : [-8,-16,-9,-7]; // fowrward, double forward, diagonal left, diagonal right
    const startRow = pieceColor === 'w' ? 1 : 6;
    if(startRow === Math.floor(piecePos/8)){
        // pawn is on start row
        if(board[piecePos+directions[0]] === ''){
            moves.push(piecePos+directions[0]);
        }
        if(board[piecePos+directions[0]] === '' && board[piecePos+directions[1]] === ''){
            
            moves.push(piecePos+directions[1]);
        }
    }
    else{
        if(board[piecePos+directions[0]] === ''){
            moves.push(piecePos+directions[0]);
        }
    }
    // captures left
    if(board[piecePos+directions[2]] !== '' && piecePos%8 != 0 ){
        if(board[piecePos+directions[2]][0] !== pieceColor){
            moves.push(piecePos+directions[2]);
        }
    }
    // captures right
    if(board[piecePos+directions[3]] !== '' && piecePos%8 != 7 ){
        if(board[piecePos+directions[3]][0] !== pieceColor){
            moves.push(piecePos+directions[3]);
        }
    }
    // unpassant
    const pawnUnpassant = fen.split(' ')[3];    
    if(pawnUnpassant !== '-'){
        const pawnUnpassantPos = sqId(pawnUnpassant);
        const pawnUnpassantColor = pawnUnpassantPos > 31 ? 'b' : 'w';
        if(pawnUnpassantColor !== pieceColor){
            if(piecePos+directions[2] === pawnUnpassantPos || piecePos+directions[3] === pawnUnpassantPos){
                moves.push(pawnUnpassantPos);
            }
        }
    }
    
    return moves;
}
function generateMoves_Knight(piecePos,board){
    // piecePos = 0-63
    // board = array of 64 chars
    const moves = [];
    const directions = [-17,-15,-10,-6,6,10,15,17];
    for(let i = 0; i < directions.length; i++){
        const targetPos = piecePos + directions[i];
        if (Math.abs(targetPos%8 - piecePos%8)>2) continue; // border limits
        if(targetPos < 0 || targetPos > 63) continue;
        if(board[targetPos] === '') moves.push(targetPos);
        else if(board[targetPos][0] !== board[piecePos][0]) moves.push(targetPos);
    }
    return moves;
}
function generateMoves_Bishop(piecePos,board){
    // piecePos = 0-63
    // board = array of 64 chars
    const moves = [];
    const directions = [-9,-7,7,9];
    for(let i = 0; i < directions.length; i++){
        let targetPos = piecePos;
        while(targetPos >= 0 && targetPos <= 63){
            if (Math.abs(targetPos%8 - (targetPos+directions[i])%8)>1) break; // border limits
            targetPos += directions[i];
            if (targetPos < 0 || targetPos > 63) break; // border limits
            if(board[targetPos] === '') moves.push(targetPos);
            else if(board[targetPos][0] !== board[piecePos][0]){
                moves.push(targetPos);
                break;
            }
            else break;
        }
    }
   return moves;
}
function generateMoves_Rook(piecePos,board){
    // piecePos = 0-63
    // board = array of 64 chars
    const moves = [];
    const directions = [-8,-1,1,8];
    for(let i = 0; i < directions.length; i++){
        let targetPos = piecePos;
        while(targetPos >= 0 && targetPos <= 63){
            if (Math.abs(targetPos%8 - (targetPos+directions[i])%8)>1) break; // border limits
            targetPos += directions[i];
            if (targetPos < 0 || targetPos > 63) break; // border limits
            if(board[targetPos] === '') moves.push(targetPos);
            else if(board[targetPos][0] !== board[piecePos][0]){
                moves.push(targetPos);
                break;
            }
            else break;
        }
    }
    return moves;
}
function generateMoves_Queen(piecePos,board){
    let bishop_moves = generateMoves_Bishop(piecePos,board);
        let rook_moves = generateMoves_Rook(piecePos,board);
        for(let i = 0; i < rook_moves.length; i++){
            bishop_moves.push(rook_moves[i]);
        }
        return bishop_moves;
}
function generateMoves_King(piecePos,board,fen){
    // piecePos = 0-63
    // board = array of 64 chars
    const moves = [];
    const directions = [-9,-8,-7,-1,1,7,8,9];
    console.log(piecePos);
    for(let i = 0; i < directions.length; i++){
        if (Math.abs(piecePos%8 - (piecePos+directions[i])%8)>1) continue; // border limits
        const targetPos = piecePos + directions[i];
        if(targetPos < 0 || targetPos > 63) continue;
        if(board[targetPos] === '') moves.push(targetPos);
        else if(board[targetPos][0] !== board[piecePos][0]) moves.push(targetPos);
    }
    // castling
    const castling = fen.split(' ')[2].split('');
    if(board[piecePos][0] === 'w'){
        if(board[4] === 'wK'){
            if(board[5] === '' && board[6] === '' && board[7] === 'wR'){
                if(castling.includes('K')){
                    moves.push(6);
                }
            }
            if(board[3] === '' && board[2] === '' && board[1] === '' && board[0] === 'wR'){
                if(castling.includes('Q')){
                    moves.push(2);
                }
            }
        }
    }
    else{
        if(board[60] === 'bK'){
            if(board[61] === '' && board[62] === '' && board[63] === 'bR'){
                if(castling.includes('k')){
                    moves.push(62);
                }                
            }
            if(board[59] === '' && board[58] === '' && board[57] === '' && board[56] === 'bR'){
                if(castling.includes('q')){
                    moves.push(58);
                }
            }
        }
    }
    return moves;
}


function generateMoves(pieceType, piecePos,board,fen){ 
    // pieceType = 'P'/'N'/'B'/'R'/'Q'/'K'
    // piecePos = 0-63
    // board = array of 64 chars

    if(pieceType === 'P') return generateMoves_Pawn(piecePos,board,fen);
    if(pieceType === 'N') return generateMoves_Knight(piecePos,board);
    if(pieceType === 'B') return generateMoves_Bishop(piecePos,board);
    if(pieceType === 'R') return generateMoves_Rook(piecePos,board);
    if(pieceType === 'Q') return generateMoves_Queen(piecePos,board);
    if(pieceType === 'K') return generateMoves_King(piecePos,board,fen);
    
    // TODO implementation of leagal moves check for checks
    
    return []; // returns array
}    

export function getLeagalMoves(fen) {
    // res {
    //  piecePos: [targetsPos]   
    // }
    const whiteToPlay = fen.split(' ')[1] === 'w';
    const board = fenToBoard(fen);
    //showBoard(board);

    const leagalMoves = {};
    for(let i = 0; i < 64; i++) {
        if(board[i] === "") continue;
        const piece = board[i];
        const pieceColor = piece[0];
        if(pieceColor !== (whiteToPlay ? 'w' : 'b')) continue;
        const pieceType = piece[1].toUpperCase();
        const piecePos = sqName(i);
        let leagalMoves_piece = generateMoves(pieceType, i,board,fen); // returns array
        leagalMoves[piecePos] = leagalMoves_piece;
    }
    return leagalMoves;
}

export function getGameState(fen) { 
    const fenParts = fen.split(' ');

    const board = fenToBoard(fen);
    const whiteToPlay = fen.split(' ')[1] === 'w';
    
    const leagalMoves_white = getLeagalMoves(fenParts[0] + ' w ' + fenParts[2] + ' ' + fenParts[3] + ' ' + fenParts[4] + ' ' + fenParts[5]);
    const leagalMoves_black = getLeagalMoves(fenParts[0] + ' b ' + fenParts[2] + ' ' + fenParts[3] + ' ' + fenParts[4] + ' ' + fenParts[5]);

    let number_of_leagal_moves_white = 0;
    let attacking_moves_white = [];
    let number_of_leagal_moves_black = 0;
    let attacking_moves_black = [];

    for(let piece in leagalMoves_white){
        number_of_leagal_moves_white += leagalMoves_white[piece].length;
        attacking_moves_white = attacking_moves_white.concat(leagalMoves_white[piece]);
    }
    for(let piece in leagalMoves_black){
        number_of_leagal_moves_black += leagalMoves_black[piece].length;
        attacking_moves_black = attacking_moves_black.concat(leagalMoves_black[piece]);
    }

    const whiteKingPos = board.findIndex(e => e === 'wK');
    const blackKingPos = board.findIndex(e => e === 'bK');

    const whiteKingInCheck = attacking_moves_black.includes(blackKingPos);
    const blackKingInCheck = attacking_moves_white.includes(whiteKingPos);

    if(whiteKingInCheck && number_of_leagal_moves_white === 0) return 'checkmate'; //'blackWin';
    if(blackKingInCheck && number_of_leagal_moves_black === 0) return 'checkmate'; //'whiteWin';
    if(!whiteKingInCheck && number_of_leagal_moves_white === 0) return 'draw';
    return 'normal';    
}

export async function getEvaluation(fen) {
    return 1; //TODO implementation
}

export function move(fen,sqIDFrom,sqIDTo){ // FIX TODO
    const board = fenToBoard(fen);
    if(!board) return {error:"No fen correct"};
    const piece = board[sqIDFrom];
    if(!piece) return {error:"No piece on sqIDFrom"};
    if(piece[0] !== fen.split(' ')[1]) return {error:"Wrong color to move"};

    let castling = fen.split(' ')[2].split('');
    // if rook captured update castling rights TODO
    if(sqIDTo === 0) castling = castling.filter(e => e !== 'Q');
    if(sqIDTo === 7) castling = castling.filter(e => e !== 'K');
    if(sqIDTo === 56) castling = castling.filter(e => e !== 'q');
    if(sqIDTo === 63) castling = castling.filter(e => e !== 'k');

    // if king captured update castling rights TODO ?? probable mot

    // if pawn 2 forward set enpassant sq
    if(piece[1].toUpperCase() === 'P' && Math.abs(sqIDFrom-sqIDTo) === 16){
        const enPassant = sqName((sqIDFrom+sqIDTo)/2);
        board[sqIDFrom] = '';
        board[sqIDTo] = piece;
        const newfen = boardToFen(board, fen.split(' ')[1]==="w"?"b":"w", fen.split(' ')[2], enPassant, fen.split(' ')[4], fen.split(' ')[5]);
        return {fen:newfen}; 
    }
    
    // handle unpassant move
    if(piece[1].toUpperCase() === 'P' && sqIDTo === sqId(fen.split(' ')[3]) && fen.split(' ')[3] !== '-'){
        board[sqIDFrom] = '';
        board[sqIDTo] = piece;
        board[sqId(fen.split(' ')[3])+(piece[0]==="w"?-8:8)] = '';
        const newfen = boardToFen(board, fen.split(' ')[1]==="w"?"b":"w", fen.split(' ')[2], '-', fen.split(' ')[4], fen.split(' ')[5]);
        return {fen:newfen}; 
    }
    
    // if rook moves update castling rights
    if(piece[1].toUpperCase() === 'R'){
        board[sqIDFrom] = '';
        board[sqIDTo] = piece;
        if(sqIDFrom === 0) castling = castling.filter(c => c !== 'Q');
        if(sqIDFrom === 7) castling = castling.filter(c => c !== 'K');
        if(sqIDFrom === 56) castling = castling.filter(c => c !== 'q');
        if(sqIDFrom === 63) castling = castling.filter(c => c !== 'k');
        const newfen = boardToFen(board, fen.split(' ')[1]==="w"?"b":"w", castling.join(""), "-", fen.split(' ')[4], fen.split(' ')[5]);
        return {fen:newfen}; 
    }

    // if king moves update castling rights
    // if king moves 2 sq its castles update rook positions
    if(piece[1].toUpperCase() === 'K'){
        board[sqIDFrom] = '';
        board[sqIDTo] = piece;
        
        if(sqIDFrom === 4 && sqIDTo === 6)   {
            castling = castling.filter(c=>!["Q","K"].includes(c)) // white short castle
            board[5] = board[7];
            board[7] = '';
        }
        if(sqIDFrom === 4 && sqIDTo === 2)   {
            castling = castling.filter(c=>!["Q","K"].includes(c)) // white long castle
            board[3] = board[0];
            board[0] = '';
        }
        if(sqIDFrom === 60 && sqIDTo === 62) {
            castling = castling.filter(c=>!["q","k"].includes(c)) // black short castle
            board[61] = board[63];
            board[63] = '';
        }
        if(sqIDFrom === 60 && sqIDTo === 58) {
            castling = castling.filter(c=>!["q","k"].includes(c)) // black long castle
            board[59] = board[56];
            board[56] = '';
        }
        
        const newfen = boardToFen(board, fen.split(' ')[1]==="w"?"b":"w", castling.join(""), "-", fen.split(' ')[4], fen.split(' ')[5]);
        return {fen:newfen}; 
    }



    board[sqIDFrom] = '';
    board[sqIDTo] = piece;

    //boardToFen(board, turn, castling, enPassant, halfMoveClock, fullMoveNumber)
    const newfen = boardToFen(board, fen.split(' ')[1]==="w"?"b":"w", castling.join(""), fen.split(' ')[3], fen.split(' ')[4], fen.split(' ')[5]);
    
    return {fen:newfen}; 
}
