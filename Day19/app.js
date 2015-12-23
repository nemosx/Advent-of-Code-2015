/**
 * Created by Michael Root on 12/22/2015.
 */
var fs = require('fs');


var s = 'abcddefed';

var chars = s.split('');
chars.splice(3, 2, 'xyz');
console.log(chars.join(''));


function findSubstrings(substring, string) {
    var indices = [];
    var index = string.indexOf(substring);
    if (index === -1) {
        return [];
    }
    indices.push(index);
    return indices.concat(findSubstrings(substring, string.slice(index + substring.length)).map(i => i + substring.length + index));
}

//parse input file
// create map replacement to substitutes [s0, s1, s2, s3]
// read input string

// for each replacement
// find substrings (there may be none)
// for each index
// split, splice @ index, substring.length, s0
// put item in SET
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

    console.log('set size:' + uniqueMolecules.size);
};


module.exports.solvePuzzle();