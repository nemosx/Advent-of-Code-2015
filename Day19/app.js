/**
 * Created by Michael Root on 12/22/2015.
 */
var fs = require('fs');

function findSubstrings(substring, string) {
    var indices = [];
    var index = string.indexOf(substring);
    if (index === -1) {
        return [];
    }
    indices.push(index);
    return indices.concat(findSubstrings(substring, string.slice(index + substring.length)).map(i => i + substring.length + index));
}


function deriveUniqueMoleculesFrom(initialMolecule, replacements) {
    const uniqueMolecules = new Set();
    Object.keys(replacements).forEach(function (substring) {
        findSubstrings(substring, initialMolecule).forEach(function (index) {
            replacements[substring].forEach(function (sub) {
                var molecule = initialMolecule.split('');
                molecule.splice(index, substring.length, sub);
                let result = molecule.join('');

                uniqueMolecules.add(result);
            })
        })
    });

    return uniqueMolecules;
}

const alreadyEvaluatedMolecules = new Set();

function buildMolecule(desiredMolecule, currentMolecule, replacements, stepCount) {
    if (currentMolecule === desiredMolecule) {
        console.log(stepCount);
        return stepCount;
    }

    let nextMolecules = deriveUniqueMoleculesFrom(currentMolecule, replacements);
    alreadyEvaluatedMolecules.add(currentMolecule);

    let lowestResult = Number.MAX_VALUE;

    Array.from(nextMolecules).forEach(molecule => {
        if (!alreadyEvaluatedMolecules.has(molecule) && molecule.length <= currentMolecule.length) {

            let currentResult = buildMolecule(desiredMolecule, molecule, replacements, stepCount + 1);
            if (currentResult !== -1) {
                lowestResult = currentResult < lowestResult ? currentResult : lowestResult;
            }
        }
    })
    return lowestResult;
}

module.exports.solvePuzzle = function (isPartTwo) {
    var desiredMolecule;
    var replacements = {};

    function processLine(line) {
        var matches = line.match(/(\w+) => (\w+)/);
        if (matches) {
            var list = replacements[matches[2]] || [];
            list.push(matches[1]);
            replacements[matches[2]] = list;
        }
        else if (line) {
            desiredMolecule = line;
        }
    }

    fs.readFileSync(__dirname + '/input.txt', 'utf-8').split('\n').forEach(processLine);

    if (isPartTwo) {
        return buildMolecule('e',desiredMolecule, replacements, 0, 0);
    }else {
        return deriveUniqueMoleculesFrom(desiredMolecule, replacements).size;
    }
};

console.log(module.exports.solvePuzzle(true));
