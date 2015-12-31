/**
 * Created by Michael Root on 12/24/2015.
 */
module.exports.solvePuzzle = function () {
    var houses = [];

    for (var elf = 1; elf < 3600000; elf++) {
        for (var houseNumber = elf; houseNumber < 3600000; houseNumber += elf) {
            houses[houseNumber] ? houses[houseNumber] += 10 * elf : houses[houseNumber] = 10 * elf;
        }
    }

    return houses.findIndex(function (presents, index) {
        return presents >= 36000000;
    });

};


console.log(module.exports.solvePuzzle());