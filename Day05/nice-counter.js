/**
 * Created by Michael Root on 12/5/2015.
 * Rules
 * It contains at least three vowels (aeiou only), like aei, xazegov, or aeiouaeiouaeiou.
 * It contains at least one letter that appears twice in a row, like xx, abcdde (dd), or aabbccdd (aa, bb, cc, or dd).
 * It does not contain the strings ab, cd, pq, or xy, even if they are part of one of the other requirements.
 */
function NiceCounter(part) {
    var niceStringCount = 0;
    var consecutiveCharacterExpression = /(\w)\1/;
    var twoLetterPairExpression = /(\w\w).*\1/;
    var repeatWithOneCharSeparationExpression = /(\w).\1/;

    function process(string) {
        if (isNice(string)) {
            console.log('Nice String: ' + string);
            niceStringCount++;
        }
    }

    function isNice(string) {
        if (part === '2') {
            return hasTwoLetterPair(string) && hasRepeatWithOneCharSeparation(string);
        }
        return hasConsecutiveLetters(string) && hasAtLeastThreeVowels(string) && hasNoBannedSubstrings(string);
    }

    function hasTwoLetterPair(string) {
        return twoLetterPairExpression.test(string);
    }

    function hasRepeatWithOneCharSeparation(string) {
        return repeatWithOneCharSeparationExpression.test(string);
    }

    function hasConsecutiveLetters(string) {
        return consecutiveCharacterExpression.test(string);
    }

    function hasAtLeastThreeVowels(string) {
        //strip non vowels & validate length
        return string.replace(/[^aeiou]/g, '').length > 2;
    }

    function hasNoBannedSubstrings(string) {
        return !(string.includes('ab') ||
        string.includes('cd') ||
        string.includes('pq') ||
        string.includes('xy'));
    }

    return {
        process: process,
        getNiceCount: function () {
            return niceStringCount;
        }
    }
}

module.exports = NiceCounter;
