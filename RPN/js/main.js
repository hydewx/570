const Stack = require('./Stack');
const Queue = require('./Queue');
const prompt = require('prompt-sync')();

function main() {
    while (true) {
        var input = prompt('please enter a infix math problem: ');
        if (input == 'quit') {
            break;
        }
        try {
            input = checkInput(input);
        } catch (e) {
            console.log(e);
            continue;
        }
        var infixQ = new Queue.Queue();
        var postQ = new Queue.Queue();
        for (var c of input) {
            infixQ.enQueue(c);
        }
        infixToPostfix(infixQ, postQ);
        output(postQ);
        var result = calculate(postQ);
        console.log('the result is: ' + result);
    }
}
main();

function checkInput(input) {
    var operands = input.split(/[+*/%)(-]|POW/g);
    for (var operand of operands) {
        if (operand.match(/\s*/) == operand) {
            continue;
        }
        if (isNaN(operand)) {
            throw 'invalid';
        }
    }
    var checkBraceStack = new Stack.Stack();
    for (let i = 0; i < input.length; i++) {
        //check negative operand
        if ((i == 0 && input[i] == '-') || (i > 0 && input[i] == '-' && input[i - 1] == '(')) {
            throw 'negative number is not allow';
        }
        if (input[i] == '(') {
            if (i != 0 && i != input.length - 1) {
                if (isOperator(input[i + 1]) && input[i + 1] != '(') {
                    //throw 'math input is invalid';
                }
                if (!isOperator(input[i - 1]) && input[i - 1] != '(' && input[i - 1] != ')') {
                    //throw 'math input is invalid';
                }
            }
            checkBraceStack.push(input[i]);
        }
        if (input[i] == ')') {
            if (i != 0 && i != input.length - 1) {
                if (isOperator(input[i - 1]) && input[i - 1] != ')') {
                    //throw 'math input is invalid';
                }
                if (!isOperator(input[i + 1]) && input[i + 1] != '(' && input[i + 1] != ')') {
                    //throw 'math input is invalid';
                }
            }
            if (checkBraceStack.length == 0) {
                throw 'parenthesis invalid';
            } else {
                checkBraceStack.pop();
            }
        }
        if (isOperator(input[i]) && i < input.length - 1) {
            if (isOperator(input[i + 1])) {
                //throw 'math input is invalid';
            }
        }
    }
    if (checkBraceStack.length != 0) {
        throw 'parenthesis invalid';
    }
    return input.replace(/\s/g, '').replace(/POW/g, '^');
}

function infixToPostfix(infixQ, postQ) {
    var opStack = new Stack.Stack();
    var t;
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
            while (!opStack.isEmpty() && opStack.top() != '(' && getPrecedence(t) <= getPrecedence(opStack.top())) {
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

function calculate(postQ) {
    var eval = new Stack.Stack();
    var t;
    var topNum, nextNum, answer;
    var operand = '';
    while (!postQ.isEmpty()) {
        t = postQ.front();
        postQ.deQueue();
        if (isDigit(t)) {
            operand += t;
        } else if (t == ' ') {
            if (operand != '') {
                eval.push(Number(operand));
                operand = '';
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
                    answer = nextNum ** topNum;
                    break;
            }
            eval.push(answer);
        }
    }
    return eval.top();
}

function output(postQ) {
    var output = '';
    for (let c of postQ) {
        output += c;
    }
    console.log('the postfix is: ' + output.replace(/\^/g, 'POW'));
}

function getPrecedence(op) {
    if (op == '+' || op == '-') {
        return 1;
    }
    if (op == '*' || op == '/' || op == '%') {
        return 2;
    }
    if (op == '^') {
        return 3;
    }
}

function isDigit(t) {
    return t.match(/[0-9.]/) ? true : false;
}

function isOperator(t) {
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