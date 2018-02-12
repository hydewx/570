#include "Queue.h"

template <class T>
Queue<T>::Queue()
{
}

template <class T>
void Queue<T>::enQueue(T t)
{
    this->push(t);
}

template <class T>
T Queue<T>::deQueue()
{
    T front = this->front();
    this->pop();
    return front;
}

template <class T>
bool Queue<T>::isEmpty()
{
    return this->empty();
}
