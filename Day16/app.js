/**
 * Created by Michael Root on 12/20/2015.
 */
var fs = require('fs');

var isPartTwo = process.argv[3] === '2';

var REAL_AUNT_SUE = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1
};

var clues = Object.keys(REAL_AUNT_SUE);


function shouldExclude(candidate, clue) {
    if (isPartTwo) {
        if (candidate.hasOwnProperty(clue)) {
            if (clue === 'cats' || clue === 'trees') {
                return candidate[clue] <= REAL_AUNT_SUE[clue];
            }
            else if (clue === 'pomeranians' || clue === 'goldfish') {
                return candidate[clue] >= REAL_AUNT_SUE[clue];
            }
            return candidate[clue] !== REAL_AUNT_SUE[clue];
        }
        return false;
    }
    return (candidate.hasOwnProperty(clue) && candidate[clue] !== REAL_AUNT_SUE[clue]);
}

var aunts = fs.readFileSync('aunts.txt', 'utf-8').split('\n'
).map(aunt =>
    aunt.match(/^Sue (\d+): (\w+): (\d+), (\w+): (\d+), (\w+): (\d+)/)
).map(matches => {
    return {
        id: +matches[1],
        [matches[2]]: +matches[3],
        [matches[4]]: +matches[5],
        [matches[6]]: +matches[7]
    };
}).filter((candidate) => {
    var exclude;
    clues.forEach((clue) => {
        if (shouldExclude(candidate, clue)) {
            exclude = true;
        }
    });
    return !exclude;
});

console.log(aunts);