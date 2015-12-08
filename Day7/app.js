/**
 * Created by Michael Root on 12/6/2015.
 */
var fs = require('fs');
var split = require('split');
var circuit = require('./circuit').initializeCircuit();

//TODO Serious Refactoring...
function getSource(source) {
    var leftSourceWireId;
    var right;
    var gate;
    var operator;
    var leftWire;
    var rightWire;

    if (source.match(/^\d+/)) {
        //source is numeric
        return Number.parseInt(source);
    }
    else if (source.match(/^\w\w$/)) {
        return circuit.getWire(source);
    }
    else if (source.includes('NOT')) {
        leftSourceWireId = source.match(/^NOT (\w+)/)[1];
        gate = circuit.createGate('NOT');
        return gate.connectWire(circuit.getWire(leftSourceWireId));
    }
    else {
        var matches = source.match(/(\w+) (AND|OR|LSHIFT|RSHIFT) (\w+|\d+)/);
        leftSourceWireId = matches[1];
        operator = matches[2];

        right = matches[3];

        leftWire = circuit.getWire(leftSourceWireId);

        if (right.match(/^\d+/)) {
            right = Number.parseInt(right);
            return circuit.createGate(operator, right).connectWire(leftWire);
        } else {
            rightWire = circuit.getWire(right);
            return circuit.createGate(operator).connectWire(leftWire).connectWire(rightWire);
        }
    }
}


fs.createReadStream('input.txt', 'utf-8')
    .pipe(split())
    .on('data', function (line) {
        var components = line.split(' -> ');
        var source = components[0];
        var wireId = components[1];

        var sourceObject = getSource(source);
        var wire = circuit.getWire(wireId);
        wire.setSource(sourceObject);

    })
    .on('end', function () {
        circuit.getWire('a').source();
    })
