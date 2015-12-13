/**
 * Created by Michael Root on 12/13/2015.
 */
var fs = require('fs');

function addNumbers(obj) {
    var sum = 0;
    var hasRedValue;
    if (typeof obj === 'number') {
        return obj;
    }
    else if (typeof obj === 'string') {
        return 0;
    }

    if (typeof obj === 'object' && !Array.isArray(obj)) {
        hasRedValue = Object.keys(obj).some(function (key) {
            return obj[key] === 'red';
        });
        if (hasRedValue) {
            return 0;
        }
    }

    Object.keys(obj).forEach(function (value) {
        sum += addNumbers(obj[value]);
    });
    return sum;
}

fs.readFile('input.json', 'utf-8', function (err, data) {
    if (!err) {
        console.log('Sum: ' + addNumbers(JSON.parse(data)));
    }
});