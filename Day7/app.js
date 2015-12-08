var fs = require('fs');
var split = require('split');
var circuit = require('./circuit').init();

function matchesRegex(string, regex, results) {
    var matches = string.match(regex);
    results.concat(matches);
    results.push.apply(results, matches);
    return matches;
}

function createNumericSource(value) {
    return {
        getSignal: function () {
            return Number.parseInt(value);
        },
        resetSignal: function () {

        }
    }
}
fs.createReadStream('input.txt', 'utf-8')
    .pipe(split())
    .on('data', function (line) {
        var assignPattern = /^(\w+) -> (\w+)/;
        var notPattern = /^NOT (\w+) -> (\w+)/;
        var binaryPattern = /^(\w+) (AND|OR|LSHIFT|RSHIFT) (\w+) -> (\w+)/
        var results = [];
        var gate;

        if (matchesRegex(line, assignPattern, results)) {
            if (!isNaN(results[1])) {
                circuit.wire(results[2]).setSource(createNumericSource(results[1]));
            } else {
                circuit.wire(results[2]).setSource(circuit.wire(results[1]));
            }
        }
        else if (matchesRegex(line, notPattern, results)) {
            gate = circuit.createGateSource('NOT');
            gate.attachInput(circuit.wire(results[1]));
            circuit.wire(results[2]).setSource(gate);
        }
        else if (matchesRegex(line, binaryPattern, results)) {
            var leftOp = results[1];
            var operator = results[2];
            var rightOp = results[3];
            var dest = results[4];

            if (operator === 'LSHIFT' || operator === 'RSHIFT') {
                gate = circuit.createGateSource(operator, rightOp);
                gate.attachInput(circuit.wire(leftOp));
                circuit.wire(dest).setSource(gate);
                return;
            } else {
                if (!isNaN(leftOp)) {
                    leftOp = createNumericSource(leftOp);
                } else {
                    leftOp = circuit.wire(results[1]);
                }
                rightOp = circuit.wire(results[3]);

                gate = circuit.createGateSource(operator);
                gate.attachInput(leftOp);
                gate.attachInput(rightOp);
                circuit.wire(dest).setSource(gate);
            }
        }

    })
    .on('end', function () {
        console.log(circuit.wire('a').getSignal());
    });