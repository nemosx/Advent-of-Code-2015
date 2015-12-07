"use strict";

/**
 * Created by Michael Root on 12/3/2015.
 * Use command line argument --part 2 for part-2 solution
 */
var fs = require('fs');
var floorClimber = require('./floor-climber').init();
var isPartTwo = process.argv[3] === '2';

fs.readFile('input.txt', 'utf-8', function (err, data) {
    if (err) {
        console.error('Could not read input file' + err);
    }

    var instructionMap = {
        '(': floorClimber.ascendFloor,
        ')': floorClimber.descendFloor
    };

    for (let i = 0, length = data.length; i < length; i++) {
        instructionMap[data[i]]();

        if (isPartTwo && floorClimber.currentFloor() === -1) {
            console.log('Current Floor = ' + floorClimber.currentFloor() + ' : ' + (i + 1));
            break;
        }
    }
    console.log(floorClimber.currentFloor());
});