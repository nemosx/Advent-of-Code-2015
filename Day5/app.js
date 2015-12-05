/**
 *
 **/
var fs = require('fs');
var split = require('split');
var niceCounter = new require('./nice-counter')();

fs.createReadStream('input.txt', 'utf-8')
    .pipe(split())
    .on('data', niceCounter.process)
    .on('end', function () {
        console.log(niceCounter.getNiceCount());
    });