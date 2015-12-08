module.exports.init = function () {
    var circuit = {};

    var ops = {
        'NOT': function (w) {
            return ~w[0].getSignal() & 0xFFFF;
        },
        'AND': function (sources) {
            return sources[0].getSignal() & sources[1].getSignal();
        },
        'OR': function (sources) {
            return sources[0].getSignal() | sources[1].getSignal();
        },
        'LSHIFT': function (shiftAmount) {
            return function (source) {
                return source[0].getSignal() << shiftAmount;
            };
        },
        'RSHIFT': function (shiftAmount) {
            return function (source) {
                return source[0].getSignal() >> shiftAmount;
            };
        }
    };

    function createWire(id) {
        var _source = -1;

        return {
            id: id,
            setSource: function (source) {
                _source = source;
            },
            getSignal: function () {
                return _source.getSignal();
            }
        };
    }

    return {
        wire: function (id) {
            var existingWire = circuit[id] || createWire(id);
            circuit[id] = existingWire;
            return existingWire;
        },
        print: function () {
            Object.keys(circuit).map(function (key) {
                console.log('ID: ' + id + ' Signal: ' + circuit[id].getSignal());
            })
        },
        createGateSource: function (type, shiftAmount) {
            var op = shiftAmount ? ops[type](shiftAmount) : ops[type];
            var inputSources = [];
            var computedValue;

            return {
                getSignal: function () {
                    computedValue = computedValue || op(inputSources);
                    return computedValue;
                },
                attachInput: function (input) {
                    inputSources.push(input);
                }
            }
        }
    }

}