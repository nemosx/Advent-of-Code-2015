/**
 * Created by Michael Root on 12/6/2015.
 */
var fs = require('fs');
var split = require('split');
var math = require('mathjs');
var parser = require('./parser');

var lightDisplay = math.zeros(1000, 1000);

var operations = {
    'on': turnOn,
    'off': turnOff,
    'toggle': toggle
};

function updateLightDisplay(instruction) {
    var instruction = parser.parseInstruction(instruction);

    var rowRangeStart = instruction.startCoordinatePair[0],
        rowRangeEnd = instruction.endCoordinatePair[0],
        colRangeStart = instruction.startCoordinatePair[1],
        colRangeEnd = instruction.endCoordinatePair[1];

    var subsetIndex = math.index(
        rowRangeStart === rowRangeEnd ? rowRangeStart : math.range(rowRangeStart, rowRangeEnd, true),
        colRangeStart === colRangeEnd ? colRangeStart : math.range(colRangeStart, colRangeEnd, true)
    );

    var updatedSubsetOfLights = lightDisplay.subset(subsetIndex).map(operations[instruction.operation]);

    lightDisplay.subset(subsetIndex, updatedSubsetOfLights);
}

function turnOn() {
    return 1;
}

function turnOff() {
    return 0;
}

function toggle(value) {
    return value ^ 1;
}

fs.createReadStream('input.txt', 'utf-8')
    .pipe(split())
    .on('data', updateLightDisplay)
    .on('end', function () {
        var count = 0;
        lightDisplay.map(function (value, index, matrix) {
            value == true ? count++ : count;
            return value;
        });
        console.log('Number On: ' + count);
    });