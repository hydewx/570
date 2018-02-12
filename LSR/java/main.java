import java.util.HashMap;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Scanner;
class LSP implements Cloneable {
    int ID;
    int sequence;
    int TTL;
    HashMap<Integer, Integer> list;
    LSP(Integer ID, HashMap<Integer, Integer> list) {
        this.ID = ID;
        this.sequence = 0;
        this.TTL = 10;
        this.list = list;
    }
    public Object clone() throws CloneNotSupportedException {
        return (LSP)super.clone();
    }
}
class Router {
    int ID;
    String network;
    HashMap<Integer, Integer> neighbors = new HashMap<Integer, Integer>();
    HashMap<Integer, HashMap<Integer, Integer>> adjacencyList = new HashMap<Integer, HashMap<Integer, Integer>>();
    HashMap<String, ArrayList> routingTable = new HashMap<String, ArrayList>();
    boolean isVisited = false;
    int cost = 0;
    String path = "";
    boolean isShutDown = false;
    int tick = 0;
    HashMap<Integer, HashMap<Integer, LSP>> receivedList = new HashMap<Integer, HashMap<Integer, LSP>>();
    static HashMap<Integer, Router> routers = new HashMap<Integer, Router>();
    
    Router(int ID, String network) {
        this.ID = ID;
        this.network = network;
        Router.routers.put(ID, this);
    }
    void receivePacket(LSP lsp, int id) {
        if (this.isShutDown == true) {
            return;
        }
        lsp.TTL--;
        if (lsp.TTL == 0) {
            return;
        }
        this.receivedList.get(this.tick).put(id, lsp);
        this.updateGraph(lsp);
        this.updateRoutingTable();
        this.sendLSP(lsp);
    }
    void originatePacket() {
        if (this.isShutDown == true) {
            return;
        }
        LSP lsp = this.generateLSP();
        this.sendLSP(lsp);
    }
    LSP generateLSP() {
        HashMap<Integer, Integer> list = this.neighbors;
        return new LSP(this.ID, list);
    }
    void sendLSP(LSP lsp) {
        for (int neighbor : this.neighbors.keySet()) {
            try {
                Router.routers.get(neighbor).receivePacket((LSP)lsp.clone(), this.ID);
            } catch (CloneNotSupportedException e) {}
        }
    }
    
    void updateGraph(LSP lsp) {
        this.adjacencyList.put(lsp.ID, lsp.list);
    }
    void updateRoutingTable() {
        this.routingTable.clear();
        if (this.adjacencyList.get(this.ID) == null) {
            HashMap<Integer, Integer> list = this.neighbors;
            this.adjacencyList.put(this.ID, list);
        }
        for (int id : this.adjacencyList.keySet()) {
            Router node = Router.routers.get(id);
            node.isVisited = false;
            node.cost = Integer.MAX_VALUE;
            node.path = "";
        }
        this.cost = 0;
        this.path += this.ID;
        while (!isAllVisited()) {
            Router min = getMin();
            for (int id : this.adjacencyList.get(min.ID).keySet()) {
                Router neighbor = Router.routers.get(id);
                if (neighbor.isVisited == false) {
                    int cost = this.adjacencyList.get(min.ID).get(id);
                    if (min.cost + cost < neighbor.cost) {
                        neighbor.cost = min.cost + cost;
                        neighbor.path = min.path;
                        neighbor.path += neighbor.ID;
                    }
                }
            }
            ArrayList<String> list = new ArrayList<String>();
            String cost = "cost=" + min.cost;
            String outgoingLink = "outgoingLink=" + (min.path.length() > 1 ? min.path.charAt(1) : "none");
            list.add(cost);
            list.add(outgoingLink);
            this.routingTable.put(min.network, list);
            min.isVisited = true;
        }
    }
    boolean isAllVisited() {
        for (int id : this.adjacencyList.keySet()) {
            if (Router.routers.get(id).isVisited == false ) {
                return false;
            }
        }
        return true;
    }
    Router getMin() {
        ArrayList<Router> unVisited = new ArrayList<Router>();
        for (int id : this.adjacencyList.keySet()) {
            Router router = Router.routers.get(id);
            if (router.isVisited == false ) {
                unVisited.add(router);
            }
        }
        unVisited.sort((a, b) -> {
            return a.cost - b.cost;
        });
        return unVisited.get(0);
    }
    void checkConnectivity() {
        for (int neighbor : this.neighbors.keySet()) {
            if (this.tick > 1) {
                if (this.receivedList.get(this.tick).get(neighbor) == null && this.receivedList.get(this.tick - 1).get(neighbor) == null) {
                    this.neighbors.put(neighbor, Integer.MAX_VALUE);
                }
            }
        }
    }
}
class main {

    public static void main(String[] args) {
        readInfile();
        while (true) {
            System.out.println("please enter\n\"C\" to continue\n\"Q\" to quit\n\"P\" followed by the router\'s id number to print the routing table of a router\n\"S\" followed by the id number to shut down a router\n\"T\" followed by the id to start up a router:");
            String input = new Scanner(System.in).nextLine().toLowerCase();
            if (input.equals("c")) {
                clearConsole();
                for (Router router : Router.routers.values()) {
                    router.tick++;
                    router.receivedList.put(router.tick, new HashMap<Integer, LSP>());
                    router.receivedList.remove(router.tick - 2);
                }
                for (Router router : Router.routers.values()) {
                    router.originatePacket();
                }
                for (Router router : Router.routers.values()) {
                    System.out.println(router.routingTable);
                }
                for (Router router : Router.routers.values()) {
                    router.checkConnectivity();
                }
            } else if (input.equals("q")) {
                break;
            }
        }
    }
    static void clearConsole() {
        System.out.print("\033[H\033[2J");
        System.out.flush();
    }
    static void readInfile() {
        String dat = "";
        try {
            dat = new String(Files.readAllBytes(Paths.get("../infile.dat")), "UTF-8");
        } catch (Exception e) {}
        String[] lines = dat.split("\n");
        Router router = null;
        for (String line : lines) {
            if (line.matches("\\d+\\s+\\d+\\.\\d+\\.\\d+")) {
                String[] data = line.split("\\s+");
                router = new Router(new Integer(data[0]), data[1]);
            } else if (line.matches("\\s*\\d+\\s*")) {
                router.neighbors.put(new Integer(line.trim()), 1);
            }
        }
    }
}