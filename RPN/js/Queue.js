class Queue extends Array {
    enQueue(e) {
        this.push(e);
    }
    deQueue() {
        return this.shift();
    }
    front() {
        return this[0];
    }
    isEmpty() {
        return this.length == 0;
    }
}
exports.Queue = Queue;