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

module.exports.solvePuzzle = function () {
    var startPoint;
    var replacements = {};
    var uniqueMolecules = new Set();


    function processLine(line) {
        var matches = line.match(/(\w+) => (\w+)/);
        if (matches) {
            var list = replacements[matches[1]] || [];
            list.push(matches[2]);
            replacements[matches[1]] = list;
        }
        else if (line) {
            startPoint = line;
        }
    }

    fs.readFileSync(__dirname + '/input.txt', 'utf-8').split('\n').forEach(processLine);

    Object.keys(replacements).forEach(function (substring) {
        findSubstrings(substring, startPoint).forEach(function (index) {
            replacements[substring].forEach(function (sub) {
                var molecule = startPoint.split('');
                molecule.splice(index, substring.length, sub);
                uniqueMolecules.add(molecule.join(''));
            })
        })
    });

    return uniqueMolecules.size;
};

