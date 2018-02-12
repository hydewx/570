class PriorityQueue extends Array {
    getSize() {
        return this.length - 1;
    }
    insert(e) {
        this.push(e);
        var index = this.length - 1;
        var parent = this.getParent(index);
        while (parent >= 1) {
            if (this.compare(parent, index)) {
                this.swap(parent, index);
                index = parent;
                parent = this.getParent(index);
            } else {
                break;
            }
        }
    }
    deleteMin() {
        this.swap(1, this.length - 1);
        var top = this.pop();
        var i = 1;
        while (true) {
            var left = 2 * i;
            var right = left + 1;
            var min = i;
            if (left < this.length && this.compare(min, left)) {
                min = left;
            }
            if (right < this.length && this.compare(min, right)) {
                min = right;
            }
            if (min == i) {
                break;
            }
            this.swap(i, min);
            i = min;
        }
        return top;
    }
    swap(a, b) {
        var temp = this[a];
        this[a] = this[b];
        this[b] = temp;
    }
    getParent(index) {
        return Math.floor(index / 2);
    }
    compare(a, b) {
        a = this[a];
        b = this[b];
        if (a.weight == b.weight) {
            return b.c.charCodeAt(0) > a.c.charCodeAt(0);
        }
        return b.weight < a.weight;
    }
}
exports.PriorityQueue = PriorityQueue;