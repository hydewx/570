const fs = require('graceful-fs');
const prompt = require('prompt-sync')();
class LSP {
    constructor(ID, sequence, list) {
        this.ID = ID;
        this.sequence = sequence;
        this.TTL = 10;
        this.list = list;
    }
}
class Router {
    constructor(ID, network) {
        this.ID = ID;
        this.network = network;
        this.neighbors = {};
        this.adjacencyList = {};
        this.routingTable = {};
        this.isVisited = false;
        this.cost = 0;
        this.path = [];
        this.isShutDown = false;
        this.tick = 0;
        this.sequence = 0;
        this.receivedList = {};
        this.origin = {};
        Router.routers[ID] = this;
    }
    receivePacket(lsp, id) {
        if (this.isShutDown) {
            return;
        }
        lsp.TTL--;
        if (lsp.TTL == 0) {
            return;
        }
        if (this.receivedList['lsp' + lsp.ID] && this.receivedList['lsp' + lsp.ID] >= lsp.sequence) {
            return;
        }
        this.receivedList[this.tick][id] = lsp;
        this.receivedList['lsp' + lsp.ID] = lsp.sequence;
        this.updateGraph(lsp);
        this.updateRoutingTable();
        this.sendLSP(lsp, id);
    }
    originatePacket() {
        if (this.isShutDown) {
            return;
        }
        var lsp = this.generateLSP();
        this.sendLSP(lsp);
    }
    generateLSP() {
        var list = {};
        for (var neighbor in this.neighbors) {
            list[neighbor] = {};
            list[neighbor].network = Router.routers[neighbor].network;
            list[neighbor].cost = this.neighbors[neighbor];
        }
        this.sequence++;
        return new LSP(this.ID, this.sequence, list);
    }
    sendLSP(lsp, id) {
        for (var neighbor in this.neighbors) {
            if (neighbor != id) {
                Router.routers[neighbor].receivePacket(this.copyLSP(lsp), this.ID);
            }
        }
    }
    updateGraph(lsp) {
        this.adjacencyList[lsp.ID] = lsp.list;
    }
    updateRoutingTable() {
        if (!this.adjacencyList[this.ID]) {
            var list = {};
            for (var neighbor in this.neighbors) {
                list[neighbor] = {};
                list[neighbor].network = Router.routers[neighbor].network;
                list[neighbor].cost = this.neighbors[neighbor];
            }
            this.adjacencyList[this.ID] = list;
        }
        var nodes = [];
        for (var id in this.adjacencyList) {
            var node = Router.routers[id];
            node.isVisited = false;
            node.cost = Number.POSITIVE_INFINITY;
            node.path = [];
            nodes.push(node);
        }
        this.cost = 0;
        this.path = [this.ID];
        while (!nodes.every(node => node.isVisited)) {
            var min = nodes.filter(node => !node.isVisited).reduce((a, b) => {
                return a.cost < b.cost ? a : b;
            });
            for (var id in this.adjacencyList[min.ID]) {
                var neighbor = Router.routers[id];
                if (!neighbor.isVisited) {
                    var cost = this.adjacencyList[min.ID][id].cost;
                    if (min.cost + cost < neighbor.cost) {
                        neighbor.cost = min.cost + cost;
                        neighbor.path = min.path.slice();
                        neighbor.path.push(neighbor.ID);
                    }
                }
            }
            this.routingTable[min.network] = {};
            this.routingTable[min.network].cost = min.cost;
            this.routingTable[min.network].outgoingLink = min.path[1] ? min.path[1] : 'none';
            min.isVisited = true;
        }
    }
    checkConnectivity() {
        for (var neighbor in this.neighbors) {
            if (this.tick > 1) {
                if (!this.receivedList[this.tick][neighbor] && !this.receivedList[this.tick - 1][neighbor]) {
                    this.neighbors[neighbor] = Number.POSITIVE_INFINITY;
                }
            }
        }
    }
    copyLSP(lsp) {
        var copy = new LSP();
        for (var i in lsp) {
            copy[i] = lsp[i];
        }
        return copy;
    }
}
Router.routers = {};
main();

function main() {
    var dat = fs.readFileSync('../infile.dat', 'utf8');
    dat = dat.split('\n');
    for (var line of dat) {
        if (line.match(/\d+\s+\d+\.\d+\.\d+/)) {
            line = line.split(/\s+/);
            var router = new Router(line[0], line[1]);
        } else if (line.match(/\s*\d+\s*/) == line) {
            router.neighbors[parseInt(line)] = 1;
        }
    }
    while (true) {
        console.log('please enter\n"C" to continue\n"Q" to quit\n"P" followed by the router\'s id number to print the routing table of a router\n"S" followed by the id number to shut down a router\n"T" followed by the id to start up a router:');
        var input = prompt().toLowerCase();
        if (input == 'c') {
            for (var router of Object.values(Router.routers)) {
                router.tick++;
                router.receivedList[router.tick] = {};
                delete router.receivedList[router.tick - 2];
            }
            for (var router of Object.values(Router.routers)) {
                router.originatePacket();
            }
            for (var router of Object.values(Router.routers)) {
                router.checkConnectivity();
            }
            console.clear();
        } else if (input == 'q') {
            break;
        } else if (input[0] == 'p') {
            console.clear();
            var id = input[1];
            console.log(Router.routers[id].routingTable);
        } else if (input[0] == 's') {
            var id = input[1];
            Router.routers[id].isShutDown = true;
            Router.routers[id].origin = Router.routers[id].neighbors;
            console.clear();
        } else if (input[0] == 't') {
            var id = input[1];
            Router.routers[id].isShutDown = false;
            Router.routers[id].neighbors = Router.routers[id].origin;
            console.clear();
        }
    }
}