/**
 * Created by Michael Root on 12/13/2015.
 */
var fs = require('fs');

fs.readFile('input.json', 'utf-8', function (err, data) {
    if (!err) {
        console.log('Sum: ' + addNumbers(JSON.parse(data)));
    }
})

function addNumbers(obj) {
    var sum = 0;
    if (typeof obj === 'number') {
        return obj;
    }
    else if (typeof obj === 'string') {
        return 0;
    }
    Object.keys(obj).map(function (key, value) {
        sum += addNumbers(obj[key]);
    });
    return sum;
}