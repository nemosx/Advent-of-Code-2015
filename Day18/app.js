/**
 * Created by Michael Root on 12/22/2015.
 */
var fs = require('fs');

module.exports.solvePuzzle = function () {
    var lightMatrix = fs.readFileSync(__dirname + '/input.txt', 'utf-8')
        .split('\n')
        .map(row => row.split(''));

    function getValue(i, j) {
        if (i < 0 || j < 0 || i >= lightMatrix.length || j >= lightMatrix.length) {
            return '.';
        }
        return lightMatrix[i][j];
    }

    function updateValue(i, j, nextValue) {
        return function () {
            lightMatrix[i][j] = nextValue;
        }
    }

    function getNeighbors(i, j) {
        var neighbors = [];
        //UpperLeft
        neighbors.push(getValue(i - 1, j - 1));
        //Above
        neighbors.push(getValue(i - 1, j));
        //UpperRight
        neighbors.push(getValue(i - 1, j + 1));
        //Right
        neighbors.push(getValue(i, j + 1));
        //BelowRight
        neighbors.push(getValue(i + 1, j + 1));
        //Below
        neighbors.push(getValue(i + 1, j));
        //BelowLeft
        neighbors.push(getValue(i + 1, j - 1));
        //Left
        neighbors.push(getValue(i, j - 1));
        return neighbors;
    }

    var iterations = 100;

    while (iterations--) {
        var updates = [];
        for (var i = 0; i < lightMatrix.length; ++i) {
            for (var j = 0; j < lightMatrix.length; ++j) {
                var currentValue = getValue(i, j);
                var onCount = getNeighbors(i, j).filter(e => e === '#').length;

                if (currentValue === '#') {
                    if (!(onCount === 2 || onCount === 3)) {
                        updates.push(updateValue(i, j, '.'));
                    }
                }
                else if (currentValue === '.' && onCount === 3) {
                    updates.push(updateValue(i, j, '#'));
                }
            }
        }
        //Apply updates
        updates.forEach(f => f());
    }


    return lightMatrix.reduce(function (prev, curr) {
        return prev + curr.reduce(function (p, c) {
                if (c === '#') {
                    return p + 1;
                }
                return p + 0;
            }, 0);
    }, 0);
};