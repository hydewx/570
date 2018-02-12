class Stack extends Array {
    /**
     * top
     */
    top() {
        return this[this.length - 1];
    }
    isEmpty() {
        return this.length == 0;
    }
}
exports.Stack = Stack;