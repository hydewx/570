const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function heapify(heap, i) {
    var left = 2 * i + 1;
    var right = left + 1;
    var max = i;
    if (left < heap.length && heap[left] > heap[max]) {
        max = left;
    }
    if (right < heap.length && heap[right] > heap[max]) {
        max = right;
    }
    if (max != i) {
        swap(heap, i, max);
        heapify(heap, max);
    }
}

function swap(heap, a, b) {
    var temp = heap[a];
    heap[a] = heap[b];
    heap[b] = temp;
}

function heapSort(heap) {
    for (var i = Math.floor(heap.length / 2); i >= 0; i--) {
        heapify(heap, i);
    }
    while (heap.length) {
        swap(heap, 0, heap.length - 1);
        var max = heap.pop();
        console.log(max);
        heapify(heap, 0);
    }
}

function checkInput(input) {
    if (input.match(/\s*/) == input || isNaN(input)) {
        throw 'invalid';
    }
    return Number(input);
}

function askForInput(heap) {
    rl.question('please enter 10 numbers into heap: ', input => {
        try {
            input = checkInput(input);
            heap.push(input);
            if (heap.length == 10) {
                heapSort(heap);
                rl.close();
                return;
            }
        } catch (e) {
            console.log(e);
        }
        askForInput(heap);
    });
}

function main() {
    askForInput([]);
}
main();