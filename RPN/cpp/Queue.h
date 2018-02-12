#ifndef QUEUE_H
#define QUEUE_H

#include <queue>
using namespace std;

template <class T>
class Queue : public queue<T> {
public:
    Queue();
    void enQueue(T t);
    T deQueue();
    bool isEmpty();
    typedef typename deque<T>::iterator iterator;
    iterator begin()
    {
        return this->c.begin();
    }
    iterator end()
    {
        return this->c.end();
    }
};

template class Queue<char>;

#endif // QUEUE_H
