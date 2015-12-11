/**
 * Created by Michael Root on 12/10/2015.
 */
var iterations = 40;
var input = '1113222113';

while (iterations--) {
    var charArray = input.split('');
    var nextSequence = '';
    var tempStorage = [];
    var currentElement;

    while (charArray.length) {
        currentElement = charArray.shift();
        if (tempStorage.length === 0 || tempStorage[0] === currentElement) {
            tempStorage.push(currentElement);
        }
        else {
            nextSequence += tempStorage.length + tempStorage[0];
            tempStorage = [];
            tempStorage.push(currentElement);
        }
    }
    if (tempStorage.length > 0) {
        nextSequence += tempStorage.length + tempStorage[0];
    }
    input = nextSequence;
}

console.log(input.length);
