class Graph {
	constructor(nodes, edges) {
		this.nodes = nodes;
		this.adjacencyMatrix = [];
		for (var i = 0; i < nodes; i++) {
			let array = [];
			array.length = nodes;
			array.fill(-1);
			this.adjacencyMatrix.push(array);
		}
		for (var edge of edges) {
			var node1 = edge.split(/\s+/)[0];
			var node2 = edge.split(/\s+/)[1];
			this.adjacencyMatrix[node1][node2] = 1;
			this.adjacencyMatrix[node2][node1] = 1;
		}
	}
	BFS(s) {
		var S = new Queue();
		S.enQueue(s);
		var bfn = {};
		var i = 1;
		bfn[s] = i;
		while (S.length != 0) {
			var v = S.deQueue();
			var unusedEdges = this.getUnusedEdges(v);
			for (let w of unusedEdges) {
				if (!bfn[w]) {
					S.enQueue(w);
					i++;
					bfn[w] = i;
				}
			}
		}
		return bfn;
	}
	getUnusedEdges(v) {
		var unusedEdges = [];
		for (let i = 0; i < this.nodes; i++) {
			if (this.adjacencyMatrix[v][i] == 1) {
				unusedEdges.push(i);
				this.adjacencyMatrix[v][i] = 0;
				this.adjacencyMatrix[i][v] = 0;
			}
		}
		return unusedEdges;
	}
}
class Queue extends Array {
	enQueue(e) {
		this.push(e);
	}
	deQueue() {
		return this.shift();
	}
}
const fs = require('fs');

function main() {
	fs.readFile('infile.dat', 'utf8', (e, data) => {
		var data = data.split('\n');
		var nodes = data[0].split(/\s+/)[0];
		data.splice(0, 1);
		var graph = new Graph(nodes, data);
		var bfn = graph.BFS(0);
		for (let i in bfn) {
			console.log(i, bfn[i]);
		}
	});
}
main();