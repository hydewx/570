class Stack < E > extends java.util.Stack < E > {
    E top() {
        return this.peek();
    }

    public boolean isEmpty() {
        return this.empty();
    }
}