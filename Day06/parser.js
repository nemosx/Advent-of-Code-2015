/**
 * Created by Michael Root on 12/6/2015.
 */
module.exports.parseInstruction = function (instruction) {
    var simplifiedInstruction = instruction.replace(/turn |through /gi, '');
    var instructionComponents = simplifiedInstruction.split(' ');

    return {
        startCoordinatePair: JSON.parse("[" + instructionComponents[1] + "]"),
        endCoordinatePair: JSON.parse("[" + instructionComponents[2] + "]"),
        operation: instructionComponents[0]
    };
};