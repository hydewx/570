#include "Stack.h"

template <class T>
Stack<T>::Stack()
{
}

template <class T>
T Stack<T>::top()
{
    if (this->isEmpty()) {
        throw exception();
    }
    return stack<T>::top();
}

template <class T>
bool Stack<T>::isEmpty()
{
    return this->empty();
}
