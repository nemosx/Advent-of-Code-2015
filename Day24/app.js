/**
 * Created by Michael Root on 2/20/2017.
 */
const fs = require('fs');
const comb = require("combinations-generator");

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
Set.prototype.difference = function(setB) {
    var difference = new Set(this);
    for (var elem of setB) {
        difference.delete(elem);
    }
    return difference;
};

const packages = fs.readFileSync('input.txt', 'utf-8')
    .split('\n')
    .map(val => {
        return parseInt(val);
    });

const PACKAGE_SET = new Set(packages);

const equalPackageWeight = packages.reduce((total, gift) => {
    return total += gift;
}, 0) / 3;

let comboSize = 1;

function checkSum(items, desiredWeight) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i];
        if (total > desiredWeight) {
            return false;
        }
    }
    return total === desiredWeight;
}

let sleighConfigurations = [];
let firstCombos = [];

while (comboSize < 7) {
    let combinations = comb(packages, comboSize);

    for (let combo of combinations) {
        if (checkSum(combo, equalPackageWeight)) {
            firstCombos.push(combo);
        }
    }
    comboSize++;
}

firstCombos.sort((a, b) => {
    return calculateQuantumEntanglement(a) - calculateQuantumEntanglement(b);
});

for (let i = 0; i < firstCombos.length; i++) {

    let firstSet = new Set(firstCombos[i]);
    let remainingAfterFirst = PACKAGE_SET.difference(firstSet);

    for (let j = 1; j < remainingAfterFirst.size; j++) {
        let nextCombos = comb(Array.from(remainingAfterFirst), j);

        for (let nextCombo of nextCombos) {
            if (checkSum(nextCombo, equalPackageWeight)) {
                // let secondSet = new Set(nextCombo);
                // let thirdSet = remainingAfterFirst.difference(secondSet);
                //
                // sleighConfigurations.push([firstSet, secondSet, thirdSet]);
                //
                // // /console.log(sleighConfigurations);

                let lowestQE = calculateQuantumEntanglement(firstCombos[i]);

                console.log('Lowest QE:' + lowestQE);
                return;
            }
        }
    }
}


function calculateQuantumEntanglement(items) {
    return items.reduce((quantumEntanglement, item) => {
        return quantumEntanglement *= item;
    }, 1);
}

// const lowestQE = sleighConfigurations.reduce((lowestQuantumEntanglement, sleighConfig) => {
//     let qe = calculateQuantumEntanglement(Array.from(sleighConfig[0]));
//     return lowestQuantumEntanglement < qe ? lowestQuantumEntanglement : qe;
// }, Number.MAX_VALUE);
//
// console.log(lowestQE);