#include <iostream>
#include <fstream>
#include <regex>
#include <queue>
#include <functional>
using namespace std;

class Node {

public:
    Node* left;
    Node* right;
    Node* parent;
    int weight;
    char c;
    
    Node(Node* left, Node* right, Node* parent, char c, int weight)
    {
        this->left = left;
        this->right = right;
        this->parent = parent;
        if (left != nullptr) {
            left->parent = this;
        }
        if (right != nullptr) {
            right->parent = this;
        }
        this->c = c;
        this->weight = weight;
    }
    
    string getPath()
    {
        string path;
        Node* node = this;
        while (node != nullptr) {
            Node* parent = node->parent;
            if (parent != nullptr) {
                if (node == parent->left) {
                    path = '0' + path;
                }
                if (node == parent->right) {
                    path = '1' + path;
                }
            }
            node = parent;
        }
        return path;
    }
};

template <class T, class Container = vector<T>, class Compare = std::less<typename Container::value_type> >
class PriorityQueue : public priority_queue<T, Container, Compare> {
public:
    PriorityQueue(const Compare& compare = Compare(),
                  const Container& cont = Container())
        : priority_queue<T, Container, Compare>(compare, cont)
    {
    }
    
    int getSize()
    {
        return this->size();
    }
    
    T deleteMin()
    {
        T top = this->top();
        this->pop();
        return top;
    }
    
    void insert(T t)
    {
        this->push(t);
    }
};

string getPercent(int weight, int length)
{
    char percent[9];
    sprintf(percent, "%7.4f%%", 100.0 * weight / length);
    return percent;
}
int main()
{
    string infile;
    ifstream in("C:/Users/WX/Desktop/New folder/570/HuffmanCodes/infile.dat");
    if (in.is_open()) {
        getline(in, infile, '\0');
        infile = regex_replace(infile, regex("\\W"), "");
        in.close();
    }
    map<char, int> map;
    for (char c : infile) {
        map[c]++;
    }
    auto cmp = [](Node * a, Node * b) {
        if (a->weight == b->weight) {
            return b->c > a->c;
        }
        return b->weight < a->weight;
    };
    PriorityQueue<Node*, vector<Node*>, decltype(cmp)> forest(cmp);
    vector<Node*> alphabet;
    for (auto pair : map) {
        Node* node = new Node(nullptr, nullptr, nullptr, pair.first, pair.second);
        alphabet.push_back(node);
        forest.insert(node);
    }
    sort(alphabet.begin(), alphabet.end(), [](Node * a, Node * b) {
        if (a->weight == b->weight) {
            return a->c < b->c;
        }
        return a->weight > b->weight;
    });
    while (forest.getSize() > 1) {
        Node* least = forest.deleteMin();
        Node* second = forest.deleteMin();
        forest.insert(new Node(second, least, nullptr, least->c, least->weight + second->weight));
    }
    string outfile = "symbol  frequency  huffman code\n\n";
    int bits = 0;
    for (Node* node : alphabet) {
        string path = node->getPath();
        outfile += string(1, node->c) + "        " + getPercent(node->weight, infile.length()) + "      " + path + '\n';
        bits += node->weight * path.length();
    }
    outfile += "\ntotal bits: " + to_string(bits);
    ofstream out("C:/Users/WX/Desktop/New folder/570/HuffmanCodes/cpp/outfile.dat");
    if (out.is_open()) {
        out << outfile;
        out.close();
    }
}
