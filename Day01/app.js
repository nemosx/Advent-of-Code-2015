"use strict";

/**
 * Created by Michael Root on 12/3/2015.
 * Use command line argument --part 2 for part-2 solution
 */
var fs = require('fs');
var floorClimber = require('./floor-climber').init();
var isPartTwo = process.argv[3] === '2';

module.exports.solvePuzzle = function () {
    var data = fs.readFileSync(__dirname + '/input.txt', 'utf-8');

    for (var i = 0, length = data.length; i < length; i++) {
        floorClimber.processInstruction(data[i]);

        if (isPartTwo && floorClimber.currentFloor() === -1) {
            console.log('Current Floor = ' + floorClimber.currentFloor() + ' : ' + (i + 1));
            break;
        }
    }
    return floorClimber.currentFloor();
};