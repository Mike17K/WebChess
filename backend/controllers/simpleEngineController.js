import { fenToBoard, showBoard } from '../HelperFunctions/index.js';

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
        if(board[piecePos+directions[0]] === '' && board[piecePos+directions[1]] === ''){
            moves.push(piecePos+directions[0]);
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
    for(let i = 0; i < directions.length; i++){
        if (Math.abs(piecePos%8 - (piecePos+directions[i])%8)>1) break; // border limits
        const targetPos = piecePos + directions[i];
        if(targetPos < 0 || targetPos > 63) continue;
        if(board[targetPos] === '') moves.push(targetPos);
        else if(board[targetPos][0] !== board[piecePos][0]) moves.push(targetPos);
    }
    // castling
    const castling = fen.split(' ')[2].split('');
    if(board[piecePos][0] === 'w'){
        if(board[60] === 'wK'){
            if(board[61] === '' && board[62] === '' && board[63] === 'wR'){
                if(castling.includes('K')){
                    moves.push(62);
                }
            }
            if(board[59] === '' && board[58] === '' && board[57] === '' && board[56] === 'wR'){
                if(castling.includes('Q')){
                    moves.push(58);
                }
                moves.push(58);
            }
        }
    }
    else{
        if(board[4] === 'bK'){
            if(board[5] === '' && board[6] === '' && board[7] === 'bR'){
                if(castling.includes('k')){
                    moves.push(6);
                }                
            }
            if(board[3] === '' && board[2] === '' && board[1] === '' && board[0] === 'bR'){
                if(castling.includes('q')){
                    moves.push(2);
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

export async function getLeagalMoves(fen) {
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


export async function getEvaluation(fen) {
    return 1; //TODO implementation
}