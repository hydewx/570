import java.util.ArrayList;
import java.util.HashMap;

class Node {

    HashMap < Character, Node > children = new HashMap < Character, Node > ();
    char c;
    boolean isEnd = false;
    String primary = "";
    int exWords = 0;

    Node(char c) {
        this.c = c;
    }

    Node insert(char c) {
        Node node = this.getChild(c);
        if (node == null) {
            node = new Node(c);
            this.children.put(c, node);
        }
        return node;
    }

    Node getChild(char c) {
        return this.children.get(c);
    }
}


class Trie {

    Node root = new Node('\0');
    HashMap < String, Integer > hitsMap = new HashMap < String, Integer > ();
    int hits = 0;
    int exWords = 0;
    Node hitNode = null;

    void insert(String name, String primary, int exWords) {
        Node node = this.root;
        for (char c: name.toCharArray()) {
            node = node.insert(c);
        }
        node.isEnd = true;
        node.primary = primary;
        node.exWords = exWords;
    }

    HashMap < String, Integer > getHitsMap(String line) {
        this.exWords = 0;
        for (int i = 0; i < line.length(); i++) {
            Node node = this.root.getChild(line.charAt(i));

            if (node == null) {
                continue;
            }

            for (int j = i + 1; j < line.length(); j++) {
                node = node.getChild(line.charAt(j));

                if (node == null) {
                    break;
                }

                if (node.isEnd) {
                    this.hitNode = node;
                }
            }

            if (this.hitNode != null) {
                String primary = this.hitNode.primary;
                int frequency = this.hitsMap.containsKey(primary) ? this.hitsMap.get(primary) : 0;
                this.hitsMap.put(primary, frequency + 1);
                this.hits++;
                this.exWords += this.hitNode.exWords;
                this.hitNode = null;
            }
        }
        return this.hitsMap;
    }
}

class ExTrie {
    Node root = new Node('\0');

    void insert(String exWord) {
        Node node = this.root;
        for (char c: exWord.toCharArray()) {
            node = node.insert(c);
        }
        node.isEnd = true;
    }

    boolean contains(String word) {
        Node node = this.root;
        for (char c: word.toLowerCase().toCharArray()) {
            node = node.getChild(c);
            if (node == null) {
                return false;
            }
        }
        return node.isEnd;
    }
}