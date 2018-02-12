const prompt = require('prompt-sync')();
const fs = require('graceful-fs');
const playerLetters = ['X', 'O', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z'];
var players = 2;
var boardSize = 3;
var winSequence = 3;
var currentPlayer = 0;
main();

function main() {
    log('                 Tic-Tac-Toe');
    var input = prompt('would you like to load a saved game? (y/n)').toLowerCase();
    switch (input) {
        case 'y':
            try {
                load();
                start();
            } catch (e) {
                log(e);
                main();
            }
            break;
        case 'n':
            init();
            start();
            break;
        default:
            main();
    }
}

function init() {
    log('please set a new game:');
    askPlayers();
    askBoardSize();
    askWinSequence();
    boardData = [];
    for (var i = 0; i < boardSize; i++) {
        let array = [];
        array.length = boardSize;
        array.fill(' ');
        boardData.push(array);
    }
}

function askPlayers() {
    players = prompt('please set players number (maximum 26): ');
    players = Number(players);
    if (Number.isInteger(players) && players > 1 && players <= 26) {
        log('players number is ' + players);
    } else {
        log('invalid');
        askPlayers();
    }
}

function askBoardSize() {
    boardSize = prompt('please set board size (maximum 999): ');
    boardSize = Number(boardSize);
    if (Number.isInteger(boardSize) && boardSize >= 3 && boardSize <= 999) {
        log('board size is ' + boardSize + 'x' + boardSize);
    } else {
        log('invalid');
        askBoardSize();
    }
}

function askWinSequence() {
    winSequence = prompt('please set win sequence: ');
    winSequence = Number(winSequence);
    if (Number.isInteger(winSequence) && winSequence >= 3 && winSequence <= boardSize) {
        log('win sequence is ' + winSequence);
    } else {
        log('invalid');
        askWinSequence();
    }
}

function drawBoard() {
    var board = '  ';
    for (var i = 1; i <= boardSize; i++) {
        board += String(i).padStart(4);
    }
    for (var row = 1; row <= boardSize; row++) {
        board += '\n' + String(row).padEnd(3);
        for (var column = 1; column <= boardSize; column++) {
            board += ' ' + boardData[row - 1][column - 1] + ' ';
            if (column < boardSize) {
                board += '|';
            }
        }
        if (row < boardSize) {
            board += '\n   ---' + '+---'.repeat(boardSize - 1);
        }
    }
    return board;
}

function getXMLelement(xml, element) {
    return xml.substring(xml.indexOf('<' + element + '>') + element.length + 2, xml.indexOf('</' + element + '>'));
}

function parseXML(xml) {
    players = getXMLelement(xml, 'players');
    boardSize = getXMLelement(xml, 'boardSize');
    winSequence = getXMLelement(xml, 'winSequence');
    currentPlayer = getXMLelement(xml, 'currentPlayer');
    var board = getXMLelement(xml, 'board');
    boardData = [];
    let array = [];
    for (var c of board) {
        array.push(c);
        if (array.length == boardSize) {
            boardData.push(array);
            array = [];
        }
    }
}

function load() {
    var name = '../' + prompt('please enter the file name: ') + '.xml';
    var xml = fs.readFileSync(name, 'utf8');
    parseXML(xml);
}

function start() {
    log('starting game...');
    var board = drawBoard();
    log(board);
    while (true) {
        var input = prompt('please enter a row and column number separated by spaces to move (type s/q to save/quit the game): ');
        if (input == 's') {
            save();
            continue;
        }
        if (input == 'q') {
            break;
        }
        try {
            input = checkInput(input);
            console.clear();
            try {
                playerMove(input[0], input[1], playerLetters[currentPlayer]);
            } catch (e) {
                log(e);
                break;
            }
        } catch (e) {
            log(e);
        }
    }
    log('the game has ended');
}
var boardData = [];

function playerMove(row, column, playerLetter) {
    boardData[row][column] = playerLetter;
    log('player ' + playerLetter + ' has moved at row: ' + (row + 1) + ' column: ' + (column + 1));
    var board = drawBoard();
    log(board);
    currentPlayer++;
    currentPlayer %= players;
    checkEnd(row, column, playerLetter);
}

function checkInput(input) {
    if (input.match(/\s*\d+\s+\d+\s*/) != input) {
        throw 'invalid';
    }
    input = input.match(/\d+/g);
    var row = input[0] - 1;
    var column = input[1] - 1;
    if (row < 0 || row >= boardSize || column < 0 || column >= boardSize) {
        throw 'invalid coordinate';
    }
    if (boardData[row][column] != ' ') {
        throw 'a player has already moved in that place';
    }
    return [row, column];
}

function checkEnd(row, column, player) {
    checkRow(row, column, player);
    checkDiagonal(row, column, player);
    checkColumn(row, column, player);
    checkTie();
}

function checkRow(row, column, player) {
    var count = 1;
    for (var i = column + 1; i < boardData.length; i++) {
        if (boardData[row][i] == player) {
            count++;
            if (count == winSequence) {
                throw 'player ' + player + ' has won';
            }
        } else {
            break;
        }
    }
    for (var i = column - 1; i >= 0; i--) {
        if (boardData[row][i] == player) {
            count++;
            if (count == winSequence) {
                throw 'player ' + player + ' has won';
            }
        } else {
            break;
        }
    }
}

function checkDiagonal(row, column, player) {
    checkDiagonal1(row, column, player);
    checkDiagonal2(row, column, player);
}

function checkDiagonal1(row, column, player) {
    var count = 1;
    for (var i = row + 1, j = column + 1; i < boardData.length && j < boardData.length; i++, j++) {
        if (boardData[i][j] == player) {
            count++;
            if (count == winSequence) {
                throw 'player ' + player + ' has won';
            }
        } else {
            break;
        }
    }
    for (var i = row - 1, j = column - 1; i >= 0 && j >= 0; i--, j--) {
        if (boardData[i][j] == player) {
            count++;
            if (count == winSequence) {
                throw 'player ' + player + ' has won';
            }
        } else {
            break;
        }
    }
}

function checkDiagonal2(row, column, player) {
    var count = 1;
    for (var i = row - 1, j = column + 1; i >= 0 && j < boardData.length; i--, j++) {
        if (boardData[i][j] == player) {
            count++;
            if (count == winSequence) {
                throw 'player ' + player + ' has won';
            }
        } else {
            break;
        }
    }
    for (var i = row + 1, j = column - 1; i < boardData.length && j >= 0; i++, j--) {
        if (boardData[i][j] == player) {
            count++;
            if (count == winSequence) {
                throw 'player ' + player + ' has won';
            }
        } else {
            break;
        }
    }
}

function checkColumn(row, column, player) {
    var count = 1;
    for (var i = row + 1; i < boardData.length; i++) {
        if (boardData[i][column] == player) {
            count++;
            if (count == winSequence) {
                throw 'player ' + player + ' has won';
            }
        } else {
            break;
        }
    }
    for (var i = row - 1; i >= 0; i--) {
        if (boardData[i][column] == player) {
            count++;
            if (count == winSequence) {
                throw 'player ' + player + ' has won';
            }
        } else {
            break;
        }
    }
}

function checkTie() {
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            if (boardData[i][j] == ' ') {
                return;
            }
        }
    }
    throw 'the game has been a tie';
}

function save() {
    var name = '../' + prompt('please enter file name: ') + '.xml';
    var xml = '<players>' + players + '</players>\n';
    xml += '<boardSize>' + boardSize + '</boardSize>\n';
    xml += '<winSequence>' + winSequence + '</winSequence>\n';
    xml += '<currentPlayer>' + currentPlayer + '</currentPlayer>\n';
    xml += '<board>';
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            xml += boardData[i][j];
        }
    }
    xml += '</board>';
    fs.writeFileSync(name, xml);
    log('the game has been successfully saved to ' + name);
}

function log(log) {
    console.log(log);
}