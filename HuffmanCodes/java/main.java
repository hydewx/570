import java.util.Scanner;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.ArrayList;

class main {

    public static void main(String[] args) {
        String infile = "";
        try {
            infile = new String(Files.readAllBytes(Paths.get("../infile.dat")), "UTF-8");
        } catch (Exception e) {}
        infile = infile.replaceAll("\\W", "");
        HashMap < Character, Integer > map = new HashMap < Character, Integer > ();
        for (char c : infile.toCharArray()) {
            int weight = map.containsKey(c) ? map.get(c) : 0;
            map.put(c, weight + 1);
        }
        ArrayList < Node > alphabet = new ArrayList < Node > ();
        PriorityQueue < Node > forest = new PriorityQueue < Node > ();
        for (char c : map.keySet()) {
            Node node = new Node(null, null, null, c, map.get(c));
            alphabet.add(node);
            forest.insert(node);
        }
        alphabet.sort((a, b) -> {
            if (a.weight == b.weight) {
                return a.c < b.c ? -1 : 1;
            }
            return a.weight > b.weight ? -1 : 1;
        });
        while (forest.getSize() > 1) {
            Node least = forest.deleteMin();
            Node second = forest.deleteMin();
            Node node = new Node(second, least, null, least.c, least.weight + second.weight);
            forest.insert(node);
        }
        String outfile = "symbol  frequency  huffman code\n\n";
        int bits = 0;
        for (Node node : alphabet) {
            String path = node.getPath();
            outfile += node.c + "        " + getPercent(node.weight, infile.length()) + "      " + path + "\n";
            bits += node.weight * path.length();
        }
        outfile += "\ntotal bits: " + bits;
        writeOutfile(outfile);
    }
    
    static String getPercent(int weight, int length) {
        return String.format("%7.4f%%", 100.0 * weight / length);
    }
    
    static void writeOutfile(String outfile) {
        try {
            Files.write(Paths.get("outfile.dat"), outfile.getBytes());
        } catch (Exception e) {}
    }
}

class Node implements Comparable < Node > {

    Node left;
    Node right;
    Node parent;
    char c;
    int weight;
    
    Node(Node left, Node right, Node parent, char c, int weight) {
        this.left = left;
        this.right = right;
        this.parent = parent;
        if (left != null) {
            left.parent = this;
        }
        if (right != null) {
            right.parent = this;
        }
        this.c = c;
        this.weight = weight;
    }
    
    public int compareTo(Node node) {
        if (this.weight == node.weight) {
            return this.c > node.c ? -1 : 1;
        }
        return this.weight < node.weight ? -1 : 1;
    }
    
    String getPath() {
        String path = "";
        Node node = this;
        while (node != null) {
            Node parent = node.parent;
            if (parent != null) {
                if (node == parent.left) {
                    path = "0" + path;
                }
                if (node == parent.right) {
                    path = "1" + path;
                }
            }
            node = parent;
        }
        return path;
    }
}

class PriorityQueue < E > extends java.util.PriorityQueue < E > {

    int getSize() {
        return this.size();
    }
    
    E deleteMin() {
        return this.poll();
    }
    
    void insert(E e) {
        this.add(e);
    }
}