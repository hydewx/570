class Queue < E > extends java.util.LinkedList < E > {
    void enQueue(E e) {
        this.add(e);
    }

    E deQueue() {
        return this.poll();
    }

    E front() {
        return this.peek();
    }

    public boolean isEmpty() {
        return this.size() == 0;
    }
}