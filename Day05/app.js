/**
 * Created by Michael Root on 12/5/2015.
 **/
var fs = require('fs');
var split = require('split');
var part = process.argv[3] || '1';

var niceCounter = new require('./nice-counter')(part);

fs.createReadStream('input.txt', 'utf-8')
    .pipe(split())
    .on('data', niceCounter.process)
    .on('end', function () {
        console.log(niceCounter.getNiceCount());
    });
