
#include <iostream>
#include <regex>
#include "Queue.h"
#include "Stack.h"
using namespace std;

bool isNaN(string s)
{
    s.erase(0, s.find_first_not_of(' '));
    s.erase(s.find_last_not_of(' ') + 1, s.npos);
    return !regex_match(s, regex("[0-9]+[.][0-9]?+|[.]?[0-9]+"));
}

void checkInput(string& input)
{
    regex e("[+*/%)(-]|POW");
    regex_token_iterator<string::iterator> i(input.begin(), input.end(), e, -1);
    regex_token_iterator<string::iterator> end;
    while (i != end) {
        string operand = *i++;
        if (regex_match(operand, regex("\\s*"))) {
            continue;
        }
        if (isNaN(operand)) {
            throw string("invalid");
        }
    }
    input = regex_replace(input, regex("POW"), "^");
    input = regex_replace(input, regex(" "), "");
}

bool isDigit(char t)
{
    return regex_match(string(1, t), regex("[0-9.]"));
}

int getPrecedence(char op)
{
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

void infixToPostfix(Queue<char> infixQ, Queue<char>& postQ)
{
    Stack<char> opStack;
    char t;

    while (!infixQ.isEmpty()) {
        t = infixQ.front();
        infixQ.deQueue();

        if (isDigit(t)) {
            postQ.enQueue(t);
            if (infixQ.isEmpty() || !isDigit(infixQ.front())) {
                postQ.enQueue(' ');
            }
        }
        else if (opStack.isEmpty()) {
            opStack.push(t);
        }
        else if (t == '(') {
            opStack.push(t);
        }
        else if (t == ')') {
            while (opStack.top() != '(') {
                postQ.enQueue(opStack.top());
                postQ.enQueue(' ');
                opStack.pop();
            }
            opStack.pop();
        }
        else {
            while (!opStack.isEmpty() && opStack.top() != '('
                && getPrecedence(t) <= getPrecedence(opStack.top())) {
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

void output(Queue<char> postQ)
{
    string output;
    for (char c : postQ) {
        output += c;
    }
    cout << "The postfix is: " << regex_replace(output, regex("\\^"), "POW") << endl;
}

double calculate(Queue<char> postQ)
{
    Stack<double> eval;
    char t;
    double topNum, nextNum, answer;
    string operand;

    while (!postQ.isEmpty()) {
        t = postQ.front();
        postQ.deQueue();

        if (isDigit(t)) {
            operand += t;
        }
        else if (t == ' ') {
            if (operand != "") {
                eval.push(stod(operand));
                operand = "";
            }
        }
        else {
            topNum = eval.top();
            eval.pop();
            nextNum = eval.top();
            eval.pop();
            switch (t) {
            case '+':
                answer = nextNum + topNum;
                break;
            case '-':
                answer = nextNum - topNum;
                break;
            case '*':
                answer = nextNum * topNum;
                break;
            case '/':
                answer = nextNum / topNum;
                break;
            case '%':
                answer = fmod(nextNum, topNum);
                break;
            case '^':
                answer = pow(nextNum, topNum);
                break;
            }
            eval.push(answer);
        }
    }
    return eval.top();
}

int main()
{
    while (true) {
        cout << "Please enter a infix math problem: ";
        string input;
        getline(cin, input);

        if (input == "quit") {
            break;
        }

        try {
            checkInput(input);
        }
        catch (string e) {
            cout << e << endl;
            continue;
        }

        Queue<char> infixQ;
        Queue<char> postQ;
        for (char c : input) {
            infixQ.enQueue(c);
        }

        infixToPostfix(infixQ, postQ);

        output(postQ);

        try {
            double result = calculate(postQ);
            cout << "The result is: " << result << endl;
        }
        catch (exception e) {
        }
    }
}
