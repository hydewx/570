var fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);
class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}
class SortedSet {
    constructor() {
        this.root = null;
    }
    isEmpty() {
        return this.root === null;
    }
    add(data) {
        var node = new Node(data);
        if (this.isEmpty()) {
            this.root = node;
            return;
        }
        var current = this.root;
        while (current) {
            if (data < current.data) {
                if (!current.left) {
                    current.left = node;
                    break;
                }
                current = current.left;
            } else if (data > current.data) {
                if (!current.right) {
                    current.right = node;
                    break;
                }
                current = current.right;
            } else {
                break;
            }
        }
    }
    remove(data, node) {
        if (node === undefined) {
            this.root = this.remove(data, this.root);
        } else if (!node) {
            return null;
        } else if (data === node.data) {
            if (!node.left && !node.right) {
                return null;
            }
            if (!node.left) {
                return node.right;
            }
            if (!node.right) {
                return node.left;
            }
            var getMin = function(node) {
                if (!node) {
                    node = this.root;
                }
                while (node.left) {
                    node = node.left;
                }
                return node.data;
            };
            var min = getMin(node.right);
            node.data = min;
            node.right = this.remove(min, node.right);
        } else if (data < node.data) {
            node.left = this.remove(data, node.left);
        } else {
            node.right = this.remove(data, node.right);
        }
        return node;
    }
    contains(data) {
        var node = this.root;
        while (node) {
            if (data === node.data) {
                return true;
            }
            if (data < node.data) {
                node = node.left;
            } else {
                node = node.right;
            }
        }
        return false;
    }
}

function checkInput(input) {
    if (input.match(/\s*\d+\s*/) != input) {
        throw 'invalid';
    }
    return Number(input);
}

function askForInput(ss) {
    rl.question('please enter a integer to find whether it is in the tree: ', input => {
        try {
            input = checkInput(input);
            if (ss.contains(input)) {
                console.log('yes');
            } else {
                console.log('no');
            }
            rl.close();
        } catch (e) {
            console.log(e);
            askForInput(ss);
        }
    });
}

function main() {
    var ss = new SortedSet();
    fs.readFile('infile.dat', 'utf8', (e, infile) => {
        if (e) {
            throw e;
        }
        var numbers = infile.split(',');
        for (var number of numbers) {
            if (number.match(/\s*\d+\s*/) == number) {
                ss.add(Number(number));
            }
        }
        inorder(ss.root);
        askForInput(ss);
    });
}
main();

function inorder(node) {
    if (node) {
        inorder(node.left);
        console.log(node.data);
        inorder(node.right);
    }
}