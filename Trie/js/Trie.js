class Node {
    constructor(c) {
        this.children = {};
        this.c = c;
    }
    insert(c) {
        var node = this.getChild(c);
        if (!node) {
            node = new Node(c);
            this.children[c] = node;
        }
        return node;
    }
    getChild(c) {
        return this.children[c];
    }
}
/**
 * Trie
 */
class Trie {
    constructor() {
        this.root = new Node(null);
        this.hitsMap = {};
        this.hits = 0;
    }
    insert(name, primary, exWords) {
        var node = this.root;
        for (var c of name) {
            node = node.insert(c);
        }
        node.isEnd = true;
        node.primary = primary;
        node.exWords = exWords;
    }
    getHitsMap(line) {
        this.exWords = 0;
        for (var i = 0; i < line.length; i++) {
            var node = this.root.getChild(line[i]);
            if (!node) {
                continue;
            }
            for (var j = i + 1; j < line.length; j++) {
                node = node.getChild(line[j]);
                if (!node) {
                    break;
                }
                if (node.isEnd) {
                    this.hitNode = node;
                }
            }
            if (this.hitNode) {
                let primary = this.hitNode.primary;
                this.hitsMap[primary] ? this.hitsMap[primary]++ : this.hitsMap[primary] = 1;
                this.hits++;
                this.exWords += this.hitNode.exWords;
                this.hitNode = null;
            }
        }
        return this.hitsMap;
    }
}
class ExTrie {
    constructor() {
        this.root = new Node(null);
    }
    insert(exWord) {
        var node = this.root;
        for (var c of exWord) {
            node = node.insert(c);
        }
        node.isEnd = true;
    }
    contains(word) {
        var node = this.root;
        for (var c of word.toLowerCase()) {
            node = node.getChild(c);
            if (!node) {
                return false;
            }
        }
        return node.isEnd;
    }
}
exports.Trie = Trie;
exports.ExTrie = ExTrie;