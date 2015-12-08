/**
 * Created by Michael Root on 12/7/2015.
 */
var gateFunctions = {
    'AND': function (wires) {
        return wires[0].source() & wires[1].source();
    },
    'OR': function (wires) {
        return wires[0].source() | wires[1].source();
    },
    'LSHIFT': function (shiftAmount) {
        return function (wire) {
            return wire[0].source() << shiftAmount;
        }
    },
    'RSHIFT': function (shiftAmount) {
        return function (wire) {
            return wire[0].source() >> shiftAmount;
        }
    },
    'NOT': function (wires) {
        return (~wires[0].source() & 0xFFFF);
    }
};


function createWire(id, source) {
    var src = source;
    return {
        id: id,
        source: function () {
            console.log('ID: ' + id);
            return Number.isInteger(src) ? src : src.source();
        },
        setSource: function (source) {
            src = source;
        }
    }
}

function createGateFunction(operator, shiftAmount) {
    if (shiftAmount) {
        return gateFunctions[operator](shiftAmount);
    }
    return gateFunctions[operator];
}

function createGate(op) {
    var wires = [];
    var gate = {
        connectWire: function (wire) {
            wires.push(wire);
            return gate;
        },
        source: function () {
            console.log('GATE: ' + wires);
            return op(wires);
        }
    };
    return gate;
};

module.exports.createWire = createWire;

module.exports.createGate = createGate;


module.exports.initializeCircuit = function () {
    var wireMap = {};

    function getWire(id, source) {
        wireMap[id] = wireMap[id] || createWire(id, source);
        return wireMap[id];
    }

    function addWire(wire) {
        wireMap[wire.id] = wire;
    }

    return {
        addWire: addWire,
        getWire: getWire,
        updateWireSource: function (id, source) {
            var wire = getWire(id);
            wire.setSource(source);
        },
        createGate: function (operator, shiftAmount) {
            var gateOperator = createGateFunction(operator, shiftAmount);
            return createGate(gateOperator);
        },
        print: function () {
            Object.keys(wireMap).map(function (key) {
                var wire = wireMap[key];
                console.log('ID: ' + wire.id);
                console.log('Signal:' + wire.source());
            });
        }
    };
}