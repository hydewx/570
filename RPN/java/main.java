import java.util.Scanner;

class main {

    static String checkInput(String input) throws Exception {
        String[] operands = input.split("[+*/%)(-]|POW");
        for (String operand : operands) {
            if (operand.matches("\\s*")) {
                continue;
            }
            if (isNaN(operand)) {
                throw new Exception("invalid");
            }
        }
        return input.replace(" ", "").replace("POW", "^");
    }
    
    static void infixToPostfix(Queue < Character > infixQ, Queue < Character > postQ) {
        Stack < Character > opStack = new Stack < Character > ();
        char t;
        while (!infixQ.isEmpty()) {
            t = infixQ.front();
            infixQ.deQueue();
            if (isDigit(t)) {
                postQ.enQueue(t);
                if (infixQ.isEmpty() || !isDigit(infixQ.front())) {
                    postQ.enQueue(' ');
                }
            } else if (opStack.isEmpty()) {
                opStack.push(t);
            } else if (t == '(') {
                opStack.push(t);
            } else if (t == ')') {
                while (opStack.top() != '(') {
                    postQ.enQueue(opStack.top());
                    postQ.enQueue(' ');
                    opStack.pop();
                }
                opStack.pop();
            } else {
                while (!opStack.isEmpty() && opStack.top() != '(' &&
                        getPrecedence(t) <= getPrecedence(opStack.top())) {
                    postQ.enQueue(opStack.top());
                    postQ.enQueue(' ');
                    opStack.pop();
                }
                opStack.push(t);
            }
        }
        while (!opStack.isEmpty()) {
            postQ.enQueue(opStack.top());
            postQ.enQueue(' ');
            opStack.pop();
        }
    }
    
    static void output(Queue < Character > postQ) {
        String output = "";
        for (char c : postQ) {
            output += c;
        }
        System.out.println("the postfix is: " + output.replace("^", "POW"));
    }
    
    static double calculate(Queue < Character > postQ) throws Exception {
        Stack < Double > eval = new Stack < Double > ();
        char t;
        double topNum, nextNum, answer = 0;
        String operand = "";
        while (!postQ.isEmpty()) {
            t = postQ.front();
            postQ.deQueue();
            if (isDigit(t)) {
                operand += t;
            } else if (t == ' ') {
                if (operand != "") {
                    eval.push(new Double(operand));
                    operand = "";
                }
            } else {
                topNum = eval.top();
                eval.pop();
                nextNum = eval.top();
                eval.pop();
                switch (t) {
                case '+':
                    answer = (nextNum * 10 + topNum * 10) / 10;
                    break;
                case '-':
                    answer = (nextNum * 10 - topNum * 10) / 10;
                    break;
                case '*':
                    answer = nextNum * 10 * topNum * 10 / 100;
                    break;
                case '/':
                    answer = nextNum * 10 / topNum * 10 / 100;
                    break;
                case '%':
                    answer = (nextNum * 10) % (topNum * 10) / 10;
                    break;
                case '^':
                    answer = Math.pow(nextNum, topNum);
                    break;
                }
                eval.push(answer);
            }
        }
        return eval.top();
    }
    
    static boolean isNaN(String s) {
        try {
            new Double(s.trim());
        } catch (NumberFormatException e) {
            return true;
        }
        return false;
    }
    
    static boolean isDigit(char t) {
        return String.valueOf(t).matches("[0-9.]");
    }
    
    static boolean isOperator(char t) {
        switch (t) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
        case '^':
            return true;
        }
        return false;
    }
    
    static int getPrecedence(char op) {
        if (op == '+' || op == '-') {
            return 1;
        }
        if (op == '*' || op == '/' || op == '%') {
            return 2;
        }
        if (op == '^') {
            return 3;
        }
        return 0;
    }
    
    public static void main(String[] args) {
        while (true) {
            System.out.println("please enter a infix math problem:");
            String input = new Scanner(System.in).nextLine();
            if (input.equals("quit")) {
                break;
            }
            try {
                input = checkInput(input);
            } catch (Exception e) {
                System.out.println(e.getMessage());
                continue;
            }
            Queue < Character > infixQ = new Queue < Character > ();
            Queue < Character > postQ = new Queue < Character > ();
            for (char c : input.toCharArray()) {
                infixQ.enQueue(c);
            }
            infixToPostfix(infixQ, postQ);
            output(postQ);
            try {
                double result = calculate(postQ);
                System.out.println("the result is: " + result);
            } catch (Exception e) {}
        }
    }
}