/**
 * Created by Michael Root on 12/3/2015.
 */
const fs = require('fs');
const split = require('split');
let totalSurfaceArea = 0;
let totalRibbon = 0;

fs.createReadStream('input.txt', 'utf-8')
    .pipe(split())
    .on('data', function (measurement) {
        let measurementComponents = measurement.split('x').sort(function (a, b) {
            return a - b;
        });

        let smallestPerimeter = 2 * measurementComponents[0] + 2 * measurementComponents[1];

        let volume = measurementComponents[0] * measurementComponents[1] * measurementComponents[2];

        totalRibbon += (smallestPerimeter + volume);

        let lw = measurementComponents[0] * measurementComponents[1],
            wh = measurementComponents[1] * measurementComponents[2],
            hl = measurementComponents[2] * measurementComponents[0];

        let surfaceArea = 2 * (lw + wh + hl);
        let smallestSideArea = Math.min(lw, wh, hl);

        totalSurfaceArea += (surfaceArea + smallestSideArea);
    })
    .on('end', function () {
        console.log(totalSurfaceArea);
        console.log('Total Ribbon Required: %d', totalRibbon);
    });

