/**
 * Created by Michael Root on 12/3/2015.
 */
var fs = require('fs');

fs.readFile('input.txt', 'utf-8', function (err, data) {
    if (err) {
        console.error('Could not read input file');
    }

    var floorInstruction,
        floor = 0,
        i = 0,
        length = data.length;

    for (; i < length; i++) {
        floorInstruction = data[i];

        if (floorInstruction === '(') {
            floor++;
        }
        else if (floorInstruction === ')') {
            floor--;
        }
        else {
            console.error('Invalid Floor Instruction: ' + floorInstruction);
        }
    }

    console.log(floor);

});