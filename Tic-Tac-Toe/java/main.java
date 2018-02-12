import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Scanner;

class main {
    static int players = 2;
    static int boardSize = 3;
    static int winSequence = 3;
    static int currentPlayer = 0;
    static String[][] boardData;
    static String[] playerLetters = {"X", "O", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "Y", "Z"};

    public static void main(String[] args) {
        log("                 Tic-Tac-Toe");
        log("would you like to load a saved game? (y/n)");
        String input = new Scanner(System.in).nextLine().toLowerCase();
        if (input.equals("y")) {
            try {
                load();
                start();
            } catch (Exception e) {
                log(e.getMessage());
                main(null);
            }
        } else if (input.equals("n")) {
            init();
            start();
        } else {
            main(null);
        }
    }
    static void log(String log)  {
        System.out.println(log);
    }
    static void load() throws Exception {
        log("please enter the file name: ");
        String name = "../" + new Scanner(System.in).nextLine() + ".xml";
        String xml = new String(Files.readAllBytes(Paths.get(name)), "UTF-8");
        parseXML(xml);
    }
    static void askPlayers() {
        log("please set players number (maximum 26): ");
        int players = new Integer(new Scanner(System.in).nextLine());
        if (players > 1 && players <= 26) {
            main.players = players;
            log("players number is " + players);
        } else {
            log("invalid");
            askPlayers();
        }
    }
    static void askBoardSize() {
        log("please set board size (maximum 999): ");
        int boardSize = new Integer(new Scanner(System.in).nextLine());
        if ( boardSize >= 3 && boardSize <= 999) {
            main.boardSize = boardSize;
            log("board size is " + boardSize + "x" + boardSize);
        } else {
            log("invalid");
            askBoardSize();
        }
    }
    static void askWinSequence() {
        log("please set win sequence: ");
        int winSequence = new Integer(new Scanner(System.in).nextLine());
        if ( winSequence >= 3 && winSequence <= boardSize) {
            main.winSequence = winSequence;
            log("win sequence is " + winSequence);
        } else {
            log("invalid");
            askWinSequence();
        }
    }
    static void init() {
        log("please set a new game:");
        askPlayers();
        askBoardSize();
        askWinSequence();
        boardData = new String[boardSize][boardSize];
        for (int i = 0; i < boardSize * boardSize; i++) {
            boardData[i / boardSize][i % boardSize] = " ";
        }
    }
    static void start() {
        log("starting game...");
        String board = drawBoard();
        log(board);
        while (true) {
            log("please enter a row and column number separated by spaces to move (type s/q to save/quit the game): ");
            String input = new Scanner(System.in).nextLine();
            if (input.equals("s")) {
                save();
                continue;
            }
            if (input.equals("q")) {
                break;
            }
            try {
                String[] coordinate = checkInput(input);
                System.out.print("\033[H\033[2J");
                System.out.flush();
                try {
                    playerMove(new Integer(coordinate[0]) - 1, new Integer(coordinate[1]) - 1, playerLetters[currentPlayer]);
                } catch (Exception e) {
                    log(e.getMessage());
                    break;
                }
            } catch (Exception e) {
                log(e.getMessage());
            }
        }
        log("the game has ended");
    }
    static String[] checkInput(String input) throws Exception {
        if (!input.matches("\\s*\\d+\\s+\\d+\\s*")) {
            throw new Exception("invalid");
        }
        String[] coordinate = input.split("\\s+");
        int row = new Integer(coordinate[0]) - 1;
        int column = new Integer(coordinate[1]) - 1;
        if (row < 0 || row >= boardSize || column < 0 || column >= boardSize) {
            throw new Exception("invalid coordinate");
        }
        if (!boardData[row][column].equals(" ")) {
            throw new Exception("a player has already moved in that place");
        }
        return coordinate;
    }
    static String drawBoard() {
        String board = "  ";
        for (int i = 1; i <= boardSize; i++) {
            board += String.format("%4d", i);
        }
        for (int row = 1; row <= boardSize; row++) {
            board += "\n" + String.format("%-3d", row);
            for (int column = 1; column <= boardSize; column++) {
                board += " " + boardData[row - 1][column - 1] + " ";
                if (column < boardSize) {
                    board += "|";
                }
            }
            if (row < boardSize) {
                board += "\n   ---" + new String(new char[boardSize - 1]).replace("\0", "+---");
            }
        }
        return board;
    }
    static void save() {
        log("please enter file name: ");
        String name = "../" + new Scanner(System.in).nextLine() + ".xml";
        String xml = "<players>" + players + "</players>\n";
        xml += "<boardSize>" + boardSize + "</boardSize>\n";
        xml += "<winSequence>" + winSequence + "</winSequence>\n";
        xml += "<currentPlayer>" + currentPlayer + "</currentPlayer>\n";
        xml += "<board>";
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                xml += boardData[i][j];
            }
        }
        xml += "</board>";
        try {
            Files.write(Paths.get(name), xml.getBytes());
        } catch (Exception e) {}
        log("the game has been successfully saved to " + name);
    }
    static void playerMove(int row, int column, String playerLetter) throws Exception {
        boardData[row][column] = playerLetter;
        log("player " + playerLetter + " has moved at row: " + (row + 1) + " column: " + (column + 1));
        String board = drawBoard();
        log(board);
        currentPlayer++;
        currentPlayer %= players;
        checkEnd(row, column, playerLetter);
    }
    static void checkEnd(int row, int column, String player) throws Exception {
        checkRow(row, column, player);
        checkDiagonal(row, column, player);
        checkColumn(row, column, player);
        checkTie();
    }
    static void checkRow(int row, int column, String player) throws Exception {
        int count = 1;
        for (int i = column + 1; i < boardData.length; i++) {
            if (boardData[row][i].equals(player)) {
                count++;
                if (count == winSequence) {
                    throw new Exception("player " + player + " has won");
                }
            } else {
                break;
            }
        }
        for (int i = column - 1; i >= 0; i--) {
            if (boardData[row][i].equals(player)) {
                count++;
                if (count == winSequence) {
                    throw new Exception("player " + player + " has won");
                }
            } else {
                break;
            }
        }
    }

    static void checkDiagonal(int row, int column, String player) throws Exception {
        checkDiagonal1(row, column, player);
        checkDiagonal2(row, column, player);
    }

    static void checkDiagonal1(int row, int column, String player) throws Exception {
        int count = 1;
        for (int i = row + 1, j = column + 1; i < boardData.length && j < boardData.length; i++, j++) {
            if (boardData[i][j].equals(player)) {
                count++;
                if (count == winSequence) {
                    throw new Exception("player " + player + " has won");
                }
            } else {
                break;
            }
        }
        for (int i = row - 1, j = column - 1; i >= 0 && j >= 0; i--, j--) {
            if (boardData[i][j].equals(player)) {
                count++;
                if (count == winSequence) {
                    throw new Exception("player " + player + " has won");
                }
            } else {
                break;
            }
        }
    }

    static void checkDiagonal2(int row, int column, String player) throws Exception {
        int count = 1;
        for (int i = row - 1, j = column + 1; i >= 0 && j < boardData.length; i--, j++) {
            if (boardData[i][j].equals(player)) {
                count++;
                if (count == winSequence) {
                    throw new Exception("player " + player + " has won");
                }
            } else {
                break;
            }
        }
        for (int i = row + 1, j = column - 1; i < boardData.length && j >= 0; i++, j--) {
            if (boardData[i][j].equals(player)) {
                count++;
                if (count == winSequence) {
                    throw new Exception("player " + player + " has won");
                }
            } else {
                break;
            }
        }
    }

    static void checkColumn(int row, int column, String player) throws Exception {
        int count = 1;
        for (int i = row + 1; i < boardData.length; i++) {
            if (boardData[i][column].equals(player)) {
                count++;
                if (count == winSequence) {
                    throw new Exception("player " + player + " has won");
                }
            } else {
                break;
            }
        }
        for (int i = row - 1; i >= 0; i--) {
            if (boardData[i][column].equals(player)) {
                count++;
                if (count == winSequence) {
                    throw new Exception("player " + player + " has won");
                }
            } else {
                break;
            }
        }
    }

    static void checkTie() throws Exception {
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                if (boardData[i][j].equals(" ")) {
                    return;
                }
            }
        }
        throw new Exception("the game has been a tie");
    }

    static void parseXML(String xml) {
        players = new Integer(getXMLelement(xml, "players"));
        boardSize = new Integer(getXMLelement(xml, "boardSize"));
        winSequence = new Integer(getXMLelement(xml, "winSequence"));
        currentPlayer = new Integer(getXMLelement(xml, "currentPlayer"));
        String board = getXMLelement(xml, "board");
        boardData = new String[boardSize][boardSize];
        for (int i = 0; i < board.length(); i++) {
            boardData[i / boardSize][i % boardSize] = String.valueOf(board.charAt(i));
        }
    }
    static String getXMLelement(String xml, String element) {
        return xml.substring(xml.indexOf("<" + element + ">") + element.length() + 2, xml.indexOf("</" + element + ">"));
    }
}