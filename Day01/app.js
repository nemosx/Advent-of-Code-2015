"use strict";
/**
 * Created by Michael Root on 12/3/2015.
 *
 */
var fs = require('fs');

module.exports.solvePuzzle = function (isPartTwo) {
    var instructions = fs.readFileSync(__dirname + '/input.txt', 'utf-8');

    var floorClimber = require('./floor-climber').init();

    for (var i = 0, length = instructions.length; i < length; i++) {
        floorClimber.processInstruction(instructions[i]);

        if (isPartTwo && floorClimber.currentFloor() === -1) {
            return i + 1;
        }
    }

    return floorClimber.currentFloor();
};