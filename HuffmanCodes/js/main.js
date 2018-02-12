const PQ = require('./PQ');
const fs = require('graceful-fs');
const prompt = require('prompt-sync')();
class Node {
    constructor(left, right, parent, c, weight) {
        this.left = left;
        this.right = right;
        this.parent = parent;
        if (left) {
            left.parent = this;
        }
        if (right) {
            right.parent = this;
        }
        this.c = c;
        this.weight = weight;
    }
    getPath() {
        var path = '';
        var node = this;
        while (node) {
            var parent = node.parent;
            if (parent) {
                if (node == parent.left) {
                    path = '0' + path;
                }
                if (node == parent.right) {
                    path = '1' + path;
                }
            }
            node = parent;
        }
        return path;
    }
}

function main() {
    var infile = readInfile();
    //get frequency
    var map = {};
    for (var c of infile) {
        map[c] ? map[c]++ : map[c] = 1;
    }
    var alphabet = [];
    var forest = new PQ.PriorityQueue();
    forest.insert(null);
    for (var c in map) {
        var node = new Node(null, null, null, c, map[c]);
        alphabet.push(node);
        forest.insert(node);
    }
    alphabet.sort((a, b) => {
        if (a.weight == b.weight) {
            return a.c.charCodeAt(0) < b.c.charCodeAt(0) ? -1 : 1;
        }
        return a.weight > b.weight ? -1 : 1;
    });
    while (forest.getSize() > 1) {
        var least = forest.deleteMin();
        var second = forest.deleteMin();
        var node = new Node(second, least, null, least.c, least.weight + second.weight);
        forest.insert(node);
    }
    //write outfile
    var outfile = 'symbol  frequency  huffman code\n\n';
    var bits = 0;
    for (let node of alphabet) {
        var path = node.getPath();
        outfile += node.c + '        ' + getPercent(node.weight, infile.length) + '%' + '      ' + path + '\n';
        bits += node.weight * path.length;
    }
    outfile += '\ntotal bits: ' + bits;
    writeOutfile(outfile);
}

function getPercent(weight, length) {
    return (100.0 * weight / length).toFixed(4).padStart(7);
}

function readInfile() {
    var path = prompt('please enter infile path: ');
    if (path) {
        path += '/';
    }
    var name = prompt('please enter infile name: ');
    if (!name) {
        name = 'infile.dat';
    }
    var infile = '';
    try {
        infile = fs.readFileSync(path + name, 'utf8');
        console.log('successfully read from ' + path + name);
        return infile.replace(/\W/g, '');
    } catch (e) {
        console.log(e);
        return readInfile();
    }
}

function writeOutfile(outfile) {
    var path = prompt('please enter outfile path: ');
    if (path) {
        path += '/';
    }
    var name = prompt('please enter outfile name: ');
    if (!name) {
        name = 'outfile.dat';
    }
    try {
        fs.writeFileSync(path + name, outfile);
        console.log('successfully wrote into ' + path + name);
    } catch (e) {
        console.log(e);
        writeOutfile(outfile);
    }
}
main();