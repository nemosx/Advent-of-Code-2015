/**
 * Created by Michael Root on 12/12/2015.
 */
var validator = require('./pass-validator');

var password = 'cqjxjnds';

function incrementPassword(password) {
    var carryDigit = 0;

    password = password.split('').reverse();

    password.map(function (currentValue, index, array) {
        //convert character to number between 0 - 25
        currentValue = currentValue.charCodeAt(0) - 97;

        var incrementedValue = currentValue;
        var valueIncremented = false;

        if (index === 0) {
            incrementedValue++;
            valueIncremented = true;
        }

        if (carryDigit) {
            incrementedValue += carryDigit;
            carryDigit = 0;
            valueIncremented = true;
        }

        if (incrementedValue % 26 === 0 && valueIncremented) {
            incrementedValue = 0;
            carryDigit = 1;
        }

        array[index] = String.fromCharCode(incrementedValue + 97);
    });

    return password.reverse().join('');
}


while (!validator.isValidPassword(password)) {
    password = incrementPassword(password);
}

console.log('Valid Password: ' + password);