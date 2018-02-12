import java.util.HashMap;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Scanner;

class main {

    public static void main(String[] args) {
        Trie trie = new Trie();
        ExTrie exTrie = new ExTrie();
        String[] exWords = {
            "a",
            "an",
            "the",
            "and",
            "or",
            "but"
        };
        for (String word : exWords) {
            exTrie.insert(word);
        }
        trie = readCompanies(trie, exTrie);
        int words = 0;
        while (true) {
            System.out.println("Please enter your article: ");
            String line = new Scanner(System.in).nextLine();
            System.out.print("\033[H\033[2J");
            System.out.flush();
            if (isEnd(line)) {
                break;
            }
            HashMap < String, Integer > hitsMap = trie.getHitsMap(line);
            int hits = trie.hits;
            words = getWords(words, line, exTrie);
            words += trie.exWords;
            String table = getFrame() + String.format("| %-" + companyLength + "s | Hit Count | Relevance |", "Company") + getFrame();
            for (String primary : hitsMap.keySet()) {
                table += String.format("| %-" + companyLength + "s | %9d | %9s |", primary, hitsMap.get(primary), getPercent(hitsMap.get(primary), words)) + getFrame();
            }
            table += String.format("| %-" + companyLength + "s | %9d | %9s |", "Total", hits, getPercent(hits, words));
            table += getFrame() + String.format("| %-" + companyLength + "s | %21d |", "Total Words", words) + getFrame();
            System.out.println(table);
        }
    }

    static int companyLength = 7;

    static Trie readCompanies(Trie trie, ExTrie exTrie) {
        String dat = "";
        try {
            dat = new String(Files.readAllBytes(Paths.get("../company.dat")), "UTF-8");
        } catch (Exception e) {}
        String[] companies = dat.split("\n");
        for (String company : companies) {
            String[] names = company.split("\t");
            companyLength = Math.max(companyLength, names[0].length());
            for (String name : names) {
                name = name.replaceAll("[^\\w\\s]", "");
                String[] words = name.split("\\s+");
                int exWords = 0;
                for (String word : words) {
                    if (!word.isEmpty() && exTrie.contains(word)) {
                        exWords++;
                    }
                }
                trie.insert(name, names[0], exWords);
            }
        }
        return trie;
    }

    static int getWords(int totalWords, String line, ExTrie exTrie) {
        String[] words = line.split("\\s+");
        for (String word : words) {
            if (!word.isEmpty() && !exTrie.contains(word)) {
                totalWords++;
            }
        }
        return totalWords;
    }

    static boolean isEnd(String line) {
        return line.matches("[.]+");
    }

    static String getPercent(int hits, int words) {
        return String.format("%.4g%%", words == 0 ? 0 : 100.0 * hits / words);
    }

    static String getFrame() {
        return String.format("\n+   %" + companyLength + "s%12s%12s\n", "+", "+", "+").replace(" ", "-");
    }
}