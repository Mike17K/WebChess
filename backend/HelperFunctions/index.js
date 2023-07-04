// Helper Functions
export function validateObj(obj, fields = []) {
    // This function checks for fields in the request
    let containsAllFields = true;
    let notFoundFields = [];
    fields.forEach(field => {
        if (obj[field] === undefined) {
            containsAllFields = false;
            notFoundFields.push(field);
        }
    })
    if (containsAllFields) {
        return true;
    } else {
        console.log("Not found fields: ", notFoundFields);
        return false;
    }
}

// TODO board to fen

export function fenToBoard(fen) {
    try {
    // This function converts a fen string to a board array
    const pieces = {p:"bP", n:"bN", b:"bB", r:"bR", q:"bQ", k:"bK", P:"wP", N:"wN", B:"wB", R:"wR", Q:"wQ", K:"wK"};
    const board = [];
    fen = fen.split(" ")[0];
    for(let i = 0; i <8; i++) {
        for(let j = 0; j <8; j++) {
            board.push("");
        }
    }
    let i = 0;
    let j = 7;
    for(let s=0; s<fen.length; s++) {
        if(fen[s] === "/"){
            i=0;
            j--;
        }
        else if(!isNaN(fen[s])) {
            i += parseInt(fen[s]);
        }
        else {
            board[i+j*8] = pieces[fen[s]];
            i++;
        }
    }
    return board;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export function boardToFen(board, turn, castling, enPassant, halfMoveClock, fullMoveNumber) { 
    // This function converts a board array to a fen string
    const pieces = {bP:"p", bN:"n", bB:"b", bR:"r", bQ:"q", bK:"k", wP:"P", wN:"N", wB:"B", wR:"R", wQ:"Q", wK:"K"};
    let fen = "";
    let empty = 0;
    for(let i = 7; i>=0; i--) {
        for(let j = 0; j <8; j++) {
            if(board[i*8+j]==="") empty++;
            else{
                if(empty>0) fen += empty;
                fen += pieces[board[i*8+j]];
                empty = 0;
            }
        }
        if(empty>0) fen += empty;
        empty = 0;
        if(i>0) fen += "/";
    }
    fen += " ";
    fen += turn;
    fen += " ";
    fen += castling;
    fen += " ";
    fen += enPassant;
    fen += " ";
    fen += halfMoveClock;
    fen += " ";
    fen += fullMoveNumber;
    return fen;
}


export function showBoard(board){
    // This function prints the board in the console
    let str = "";
    str += "\n";
    const pieces = {bP:"♟", bN:"♞", bB:"♝", bR:"♜", bQ:"♛", bK:"♚", wP:"♙", wN:"♘", wB:"♗", wR:"♖", wQ:"♕", wK:"♔"};

    for(let i = 7; i>=0; i--) {
        str += "\n"+(i+1)+" | ";
        for(let j = 0; j <8; j++) {
            if(board[i*8+j]==="") str += ". ";
            else{
                str += pieces[board[i*8+j]] + " ";
            }
        }
        str += "|";
    }
    str += "\n    a b c d e f g h";
    str += "\n";
    console.log(str);
}
