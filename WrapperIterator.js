class Vector {
    constructor() {
        this.container = [];
        for (var e of arguments) {
            this.container.push(e);
        }
        this.setLength();
    }
    checkIndex(index) {
        if (index < 0 || index >= this.length) {
            throw 'invalid index';
        }
    }
    get(index) {
        try {
            checkIndex(index);
        } catch (e) {
            return undefined;
        }
        return this.container[index];
    }
    set(index, e) {
        try {
            checkIndex(index);
        } catch (e) {
            return;
        }
        this.container[index] = e;
    }
    push(e) {
        this.container.push(e);
        this.setLength();
    }
    pop() {
        this.container.pop();
        this.setLength();
    }
    insert(index, e) {
        this.container.splice(index, index - 1, e);
        this.setLength();
    }
    setLength() {
            this.length = this.container.length;
        }
        *[Symbol.iterator]() {
            for (let e of this.container) {
                yield e;
            }
        }
        * gen() {
            for (let e of this.container) {
                yield e;
            }
        }
}