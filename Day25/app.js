/**
 * Created by Michael Root on 2/21/2017.
 */
const codes = [];

function getNextCode(previousCode) {
    return  previousCode === 0 ? 20151125 : (previousCode * 252533) % 33554393;
}



let previousCode = 0;

for ( let currentIndex = 1;currentIndex < 10000; currentIndex++) {
    let i = currentIndex;
    let j = 1;

    while (i > 0) {
        if (!codes[i]) {
            codes[i] = [];
        }
        let nextCode = getNextCode(previousCode);

        codes[i][j] = nextCode;
        previousCode = nextCode;
        i--;
        j++;
    }

    if (codes[2947]) {
        if (codes[2947].length === 3030) {
            break;
        }
    }
}

console.log(codes[2947][3029]);