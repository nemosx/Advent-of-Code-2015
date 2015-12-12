/**
 * Created by Michael Root on 12/12/2015.
 */


var twoLetterPairExpression = /(\w)\1.*(\w)\2/;

module.exports.isValidPassword = function (password) {

    return hasNoBannedSubstrings(password) &&
        hasOneIncreasingStraight(password) &&
        hasTwoNonOverlappingPairs(password);

};

function hasOneIncreasingStraight(password) {
    var chars = password.split('');

    for (var i = 0; i < chars.length - 2; ++i) {
        if (chars[i + 1].charCodeAt(0) - chars[i].charCodeAt(0) === 1 && chars[i + 2].charCodeAt(0) - chars[i + 1].charCodeAt(0) === 1) {
            return true;
        }
    }
    return false;
}

function hasTwoNonOverlappingPairs(password) {
    return twoLetterPairExpression.test(password);
}

function hasNoBannedSubstrings(string) {
    return !(string.includes('i') ||
    string.includes('o') ||
    string.includes('l') ||
    string.includes('cqjxxyzz'));
}

