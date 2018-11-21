
/*
 * Implementation Dijkstra's algorithm
 *
 * Copyright (C) 
 * Author: Eddie Saidov
 */

const log = (c) => {
    console.log(`%c${c}`, 'background: #fff; color: green');
}

class Node {

    constructor(name) {
        this.name = name;
        this.weight = Infinity;
        this.previous = null;
        this.incidentEdges = [];
    }

    get incidentNodes() {
        let nodes = new Set();
        for (let e of this.edges) {
            nodes.add(e.incidentNode(this));
        }
        return nodes;
    }

    connect(currentNode, w) {
        let edge = new Edge(this, currentNode, w);
        this.incidentEdges.push(edge);
        currentNode.incidentEdges.push(edge);
        return edge;
    }

}

class Edge {
    
    constructor(v1, v2, weight) {
        this.v1 = v1;
        this.v2 = v2;
        this.weight = weight;
    }

    incidentNode(currentNode) {
        if (currentNode == this.v1)
            return this.v2;
        if (currentNode == this.v2)
            return this.v1
        throw new Error('incident node is not defined');
    }

}

class Graph {

    constructor(size) {
        this.size = size;
        this.nodes = [];
        this.edges = [];
        for (let i = 0; i < size; ++i) {
            this.nodes.push(new Node(i));
        }
    }

    node(index) {
        return this.nodes[index];
    }

    addNode(v1, v2, w) {
        let e = this.nodes[v1].connect(this.nodes[v2], w);
        this.edges.push(e);
    }

    static create(g, count) {
        let graph = new Graph(count);

        for (let i = 0; i < g.length - 1; i += 3) {
            graph.addNode(g[i], g[i + 1], g[i + 2]);
        }
        return graph;
    }

    static logPath(currentNode, nextNode, edge) {
        console.log(`from ${currentNode.name} to ${nextNode.name} min(${currentNode.weight} + ${edge.weight}, ${nextNode.weight == Infinity ? '∞': nextNode.weight})`);
    }

}

const getMinWeightNode = (unvisiteds) => unvisiteds.reduce((a, b) => a.weight < b.weight ? a : b);

const dijkstraPath = (graph, startNode, endNode) => {
    startNode.weight = 0;

    const unvisiteds = new Set(graph.nodes);
    const visiteds = [];
    let iter = 1;
    let currentNode;

    while (unvisiteds.size > 0) {
        log(`iteration: ${iter}`);

        currentNode = getMinWeightNode(Array.from(unvisiteds));
        
        for (let e of currentNode.incidentEdges) {
            let nextNode = e.incidentNode(currentNode);

            if (!visiteds.includes(currentNode)) {
                Graph.logPath(currentNode, nextNode, e);

                let pathWeight = currentNode.weight + e.weight;
                if (pathWeight < nextNode.weight) {
                    nextNode.weight = pathWeight;
                    nextNode.previous = currentNode;
                }

            }
        }
        unvisiteds.delete(currentNode);
        visiteds.push(currentNode);

        iter += 1;
    }

    const minPath = [];
    for (let n = endNode, i = 0; n; n = n.previous, i += 1) {
        minPath.push(n.name);
    }
    console.log(`\ndijkstra path: ${minPath.reverse()}`);
    console.log(`\nmin weight paths to each node:`);
    graph.nodes.forEach(n => console.log(`node: ${n.name}, weight: ${n.weight}`));
};


let graph = Graph.create(
    [
        0, 1, 7,
        0, 5, 14,
        0, 2, 9,
        1, 2, 10,
        1, 3, 15,
        2, 3, 11,
        2, 5, 2,
        3, 4, 6,
        4, 5, 9
    ], 6 
);
const start = 0;
const end = 4;


dijkstraPath(graph, graph.node(start), graph.node(end));