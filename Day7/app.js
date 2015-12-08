var fs = require('fs');
var split = require('split');
var circuit = require('./circuit').init();

function matchesRegex(string, regex, results) {
    var matches = string.match(regex);
    results.concat(matches);
    results.push.apply(results, matches);
    return matches;
}

fs.createReadStream('input.txt', 'utf-8')
    .pipe(split())
    .on('data', function (line) {
        var assignPattern = /^(\w+) -> (\w+)/;
        var notPattern = /^NOT (\w+) -> (\w+)/;
        var binaryPattern = /^(\w+) (AND|OR|LSHIFT|RSHIFT) (\w+) -> (\w+)/;
        var results = [];
        var gate;

        if (matchesRegex(line, assignPattern, results)) {
            if (!isNaN(results[1])) {
                circuit.wire(results[2]).setSource(circuit.createNumericSource(results[1]));
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
            } else {
                if (!isNaN(leftOp)) {
                    leftOp = circuit.createNumericSource(leftOp);
                    gate = circuit.createGateSource(operator);
                    gate.attachInput(leftOp);
                    gate.attachInput(rightOp);
                } else {
                    leftOp = circuit.wire(results[1]);
                }
                rightOp = circuit.wire(results[3]);

                circuit.wire(dest).setSource(gate);
            }
        }

    })
    .on('end', function () {
        console.log(circuit.wire('a').getSignal());

        circuit.wire('b').setSource(circuit.createNumericSource(circuit.wire('a').getSignal()));

        circuit.reset();

        console.log(circuit.wire('a').getSignal());
    });
