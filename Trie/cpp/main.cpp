#include <iostream>
#include <fstream>
#include <regex>
using namespace std;

class Node {

public:
    map<char, Node*> children;
    char c;
    bool isEnd = false;
    string primary;
    int exWords = 0;

    Node(char c)
    {
        this->c = c;
    }

    Node* insert(char c)
    {
        Node* node = this->getChild(c);
        if (node == nullptr) {
            node = new Node(c);
            this->children[c] = node;
        }
        return node;
    }

    Node* getChild(char c)
    {
        return this->children[c];
    }
};

class Trie {
public:
    Node* root = new Node('\0');
    map<string, int> hitsMap;
    int hits = 0;
    int exWords = 0;
    Node* hitNode = nullptr;

    void insert(string name, string primary, int exWords)
    {
        Node* node = this->root;
        for (char c : name) {
            node = node->insert(c);
        }
        node->isEnd = true;
        node->primary = primary;
        node->exWords = exWords;
    }

    map<string, int> getHitsMap(string line)
    {
        this->exWords = 0;
        for (int i = 0; i < line.length(); i++) {
            Node* node = this->root->getChild(line[i]);
            if (node == nullptr) {
                continue;
            }
            for (int j = i + 1; j < line.length(); j++) {
                node = node->getChild(line[j]);
                if (node == nullptr) {
                    break;
                }
                if (node->isEnd) {
                    this->hitNode = node;
                }
            }
            if (this->hitNode != nullptr) {
                hitsMap[this->hitNode->primary]++;
                this->hits++;
                this->exWords += this->hitNode->exWords;
                this->hitNode = nullptr;
            }
        }
        return this->hitsMap;
    }
};

class ExTrie {
public:
    Node* root = new Node('\0');

    void insert(string exWord)
    {
        Node* node = this->root;
        for (char c : exWord) {
            node = node->insert(c);
        }
        node->isEnd = true;
    }

    bool contains(string word)
    {
        std::for_each(word.begin(), word.end(), [](char& c) {
            c = ::tolower(c);
        });
        Node* node = this->root;
        for (char c : word) {
            node = node->getChild(c);
            if (node == nullptr) {
                return false;
            }
        }
        return node->isEnd;
    }
};

vector<string> split(string s, string regex)
{
    std::regex e(regex);
    regex_token_iterator<string::iterator> i(s.begin(), s.end(), e, -1);
    regex_token_iterator<string::iterator> end;
    vector<string> v;
    while (i != end) {
        v.push_back(*i++);
    }
    return v;
}

int companyLength = 7;
void readCompanies(Trie& trie, ExTrie exTrie)
{
    string dat;
    ifstream file("C:/Users/WX/Desktop/New folder/570/Trie/company.dat");
    if (file.is_open()) {
        getline(file, dat, '\0');
        file.close();
    }
    auto companies = split(dat, "\n");
    for (string company : companies) {
        auto names = split(company, "\t");
        companyLength = max(companyLength, (int)names[0].length());
        for (string name : names) {
            name = regex_replace(name, regex("[^\\w\\s]"), "");
            auto words = split(name, "\\s+");
            int exWords = 0;
            for (string word : words) {
                if (word != "" && exTrie.contains(word)) {
                    exWords++;
                }
            }
            trie.insert(name, names[0], exWords);
        }
    }
}

bool isEnd(string line)
{
    return regex_match(line, regex("[.]+"));
}

void getWords(int& totalWords, string line, ExTrie exTrie)
{
    auto words = split(line, "\\s+");
    for (string word : words) {
        if (word != "" && !exTrie.contains(word)) {
            totalWords++;
        }
    }
}

const char* getPercent(int hits, int words)
{
    char b[9];
    sprintf(b, "%.4g%%", words == 0 ? 0 : 100.0 * hits / words);
    return string(b).c_str();
}

string getFrame()
{
    char b[99];
    string format = "\n+   %" + to_string(companyLength) + "s%12s%12s\n";
    sprintf(b, format.c_str(), "+", "+", "+");
    return regex_replace(b, regex(" "), "-");
}

int main()
{
    Trie trie;
    ExTrie exTrie;
    string exWords[] = { "a", "an", "and", "the", "or", "but" };
    for (string word : exWords) {
        exTrie.insert(word);
    }
    readCompanies(trie, exTrie);
    int words = 0;
    while (true) {
        cout << "Please enter your article: ";
        string line;
        getline(cin, line);
        system("CLS");
        if (isEnd(line)) {
            break;
        }
        auto hitsMap = trie.getHitsMap(line);
        int hits = trie.hits;
        getWords(words, line, exTrie);
        words += trie.exWords;
        char b[99];
        string format = "| %-" + to_string(companyLength) + "s | Hit Count | Relevance |";
        sprintf(b, format.c_str(), "Company");
        string table = getFrame() + b + getFrame();
        for (auto e : hitsMap) {
            format = "| %-" + to_string(companyLength) + "s | %9d | %9s |";
            sprintf(b, format.c_str(), e.first.c_str(), e.second, getPercent(e.second, words));
            table += b + getFrame();
        }
        format = "| %-" + to_string(companyLength) + "s | %9d | %9s |";
        sprintf(b, format.c_str(), "Total", hits, getPercent(hits, words));
        table += b;
        format = "| %-" + to_string(companyLength) + "s | %21d |";
        sprintf(b, format.c_str(), "Total Words", words);
        table += getFrame() + b + getFrame();
        cout << table;
    }
}
