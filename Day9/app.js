/**
 * Created by Michael Root on 12/9/2015.
 */
var fs = require('fs');
var split = require('split');
var permutationEngine = require('permutation-engine');

function Graph() {
    var _edgeMap = {};
    var _vertices = {};

    this.addEdge = function (edge) {
        _edgeMap[edge.from + '-' + edge.to] = edge;
    };

    this.addVertex = function (v) {
        _vertices[v.name] = _vertices[v.name] || v;
    };

    this.getDistance = function (from, to) {
        return _edgeMap[from + '-' + to].distance;
    };

    this.getVertexArray = function () {
        return Object.keys(_vertices);
    };

    this.print = function () {
        console.log(_edgeMap);
    };
}
function Vertex(name) {
    this.name = name;
}

function Edge(from, to, distance) {
    this.from = from;
    this.to = to;
    this.distance = distance;
}

var graph = new Graph();

function processInput(line) {
    var distance_mapping_regex = /^(\w+) to (\w+) = (\d+)/;
    var matches = line.match(distance_mapping_regex);

    graph.addVertex(new Vertex(matches[1]));
    graph.addVertex(new Vertex(matches[2]));

    graph.addEdge(new Edge(matches[1], matches[2], Number.parseInt(matches[3])));
    graph.addEdge(new Edge(matches[2], matches[1], Number.parseInt(matches[3])));
}

function calculateShortestPath() {
    var shortestDistance = Number.MAX_VALUE;
    var longestDistance = Number.MIN_VALUE;

    var shortestPath = [];
    var longestPath = [];

    var vertices = graph.getVertexArray();

    var engine = new permutationEngine(vertices.length);
    var length = engine.perm2index(engine.lastPerm());


    var totalDistance = 0;
    var perm;

    for (var i = 0; i < length; ++i) {
        perm = engine.index2perm(i);
        totalDistance = 0;

        for (var j = 0; j < perm.length - 1; ++j) {
            var from = vertices[perm[j] - 1];
            var to = vertices[perm[j + 1] - 1];
            totalDistance += graph.getDistance(from, to);
        }

        if (totalDistance < shortestDistance) {
            shortestDistance = totalDistance;
            shortestPath = perm;
        }
        if (totalDistance > longestDistance) {
            longestDistance = totalDistance;
            longestPath = perm;
        }
    }

    console.log('The shortest distance: ' + shortestDistance);
    console.log('The longest distance: ' + longestDistance);
    console.log('The shortest path: ' + shortestPath);
    console.log('The longest path: ' + longestPath);
}

fs.createReadStream('input.txt', 'utf-8')
    .pipe(split())
    .on('data', processInput)
    .on('end', calculateShortestPath);