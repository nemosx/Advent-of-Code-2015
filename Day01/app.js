/**
 * Created by Michael Root on 12/3/2015.
 *
 */
module.exports.solvePuzzle = function (isPartTwo) {
    let firstTimeToBasement = undefined;
    const fs = require('fs');
    const finalFloor = fs.readFileSync('input.txt', 'utf-8')
        .split('')
        .reduce((currentFloor, instruction, currentIndex) => {
            if (currentFloor === -1 && !firstTimeToBasement) {
                firstTimeToBasement = currentIndex;
            }

            let nextFloor = instruction === '('? ++currentFloor : --currentFloor;
            return nextFloor;
        }, 0);

    return isPartTwo ? firstTimeToBasement : finalFloor;
};

const assert = require('assert');
assert(module.exports.solvePuzzle() === 138);
assert(module.exports.solvePuzzle(true) === 1771);