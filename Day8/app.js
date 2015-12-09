/**
 * Created by Michael Root on 12/8/2015.
 */
var fs = require('fs');
var split = require('split');

var codedCharacterCount = 0;
var processedCount = 0;

fs.createReadStream('input.txt', 'utf-8')
    .pipe(split())
    .on('data', function (line) {
        var processedLine = line.replace(/\\"/g, '"')
            .replace(/\\x[0-9a-f]{2}/g, 'Z')
            .replace(/\\\\/g, '\\');

        processedCount += (processedLine.length - 2);
        codedCharacterCount += line.length;
    })
    .on('end', function () {
        console.log('Count difference: ' + (codedCharacterCount - processedCount));
    });