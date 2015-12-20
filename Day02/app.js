/**
 * Created by Michael Root on 12/3/2015.
 */
var fs = require('fs');
var split = require('split');
var totalSurfaceArea = 0;
var totalRibbon = 0;

fs.createReadStream('input.txt', 'utf-8')
    .pipe(split())
    .on('data', function (measurement) {
        var measurementComponents = measurement.split('x').sort(function (a, b) {
            return a - b;
        });

        var smallestPerimeter = 2 * measurementComponents[0] + 2 * measurementComponents[1];

        var volume = measurementComponents[0] * measurementComponents[1] * measurementComponents[2];

        totalRibbon += (smallestPerimeter + volume);

        var lw = measurementComponents[0] * measurementComponents[1],
            wh = measurementComponents[1] * measurementComponents[2],
            hl = measurementComponents[2] * measurementComponents[0];

        var surfaceArea = 2 * (lw + wh + hl);
        var smallestSideArea = Math.min(lw, wh, hl);

        totalSurfaceArea += (surfaceArea + smallestSideArea);
    })
    .on('end', function () {
        console.log(totalSurfaceArea);
        console.log('total ribbon' + totalRibbon);
    });

