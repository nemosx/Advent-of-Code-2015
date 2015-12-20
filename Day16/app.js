/**
 * Created by Michael Root on 12/20/2015.
 */
var fs = require('fs');

var master = {
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

var keys = Object.keys(master);

var aunts = fs.readFileSync('aunts.txt', 'utf-8').split('\n'
).map(aunt => {
    return aunt.match(/^Sue (\d+): (\w+): (\d+), (\w+): (\d+), (\w+): (\d+)/);
}).map(matches => {
    return {
        id: +matches[1],
        [matches[2]]: +matches[3],
        [matches[4]]: +matches[5],
        [matches[6]]: +matches[7]
    };
}).map(candidate => {
    keys.forEach((key) => {
        if (candidate.hasOwnProperty(key) && candidate[key] !== master[key]) {
            candidate['exclude'] = true;
        }
    });
    return candidate;
}).filter((candidate) => {
    return !candidate.exclude;
});

console.log(aunts);