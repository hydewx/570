const Trie = require('./Trie');
const prompt = require('prompt-sync')();
const fs = require('graceful-fs');

function main() {
    var trie = new Trie.Trie();
    var exTrie = new Trie.ExTrie();
    var exWords = ['a', 'an', 'the', 'and', 'or', 'but'];
    for (var word of exWords) {
        exTrie.insert(word);
    }
    readCompanies(trie, exTrie);
    var words = 0;
    while (true) {
        var line = prompt('Please enter your article: ');
        console.clear();
        if (isEnd(line)) {
            break;
        }
        var hitsMap = trie.getHitsMap(line);
        var hits = trie.hits;
        words = getWords(words, line, exTrie);
        words += trie.exWords;
        var table = getFrame() + '| ' + 'Company'.padEnd(companyLength) + ' | Hit Count | Relevance |' + getFrame();
        for (var primary in hitsMap) {
            table += '| ' + primary.padEnd(companyLength) + ' | ' + String(hitsMap[primary]).padStart(9) + ' | ' + getPercent(hitsMap[primary], words).padStart(9) + ' |' + getFrame();
        }
        table += '| ' + 'Total'.padEnd(companyLength) + ' | ' + String(hits).padStart(9) + ' | ' + getPercent(hits, words).padStart(9) + ' |';
        table += getFrame() + '| ' + 'Total Words'.padEnd(companyLength) + ' | ' + String(words).padStart(21) + ' |' + getFrame();
        console.log(table);
    }
}
var companyLength = 7;

function readCompanies(trie, exTrie) {
    var dat = fs.readFileSync('../company.dat', 'utf8');
    var companies = dat.split('\n');
    for (var company of companies) {
        var names = company.split('\t');
        companyLength = Math.max(companyLength, names[0].length);
        for (var name of names) {
            name = name.replace(/[^\w\s]/g, '');
            var words = name.split(/\s+/g);
            var exWords = 0;
            for (var word of words) {
                if (word && exTrie.contains(word)) {
                    exWords++;
                }
            }
            trie.insert(name, names[0], exWords);
        }
    }
}

function getWords(totalWords, line, exTrie) {
    var words = line.split(/\s+/g);
    for (var word of words) {
        if (word && !exTrie.contains(word)) {
            totalWords++;
        }
    }
    return totalWords;
}

function isEnd(line) {
    return line.match(/[.]+/g) == line;
}

function getPercent(hits, words) {
    return (words == 0 ? 0 : 100.0 * hits / words).toPrecision(4) + '%';
}

function getFrame() {
    return ('\n+   ' + '+'.padStart(companyLength) + '+'.padStart(12) + '+'.padStart(12) + '\n').replace(/ /g, '-');
}
main();