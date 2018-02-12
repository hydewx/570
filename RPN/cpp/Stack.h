#ifndef STACK_H
#define STACK_H

#include <stack>
using namespace std;

template <class T>
class Stack : public stack<T> {
public:
    Stack();
    T top();
    bool isEmpty();
};

template class Stack<char>;
template class Stack<double>;

#endif // STACK_H
