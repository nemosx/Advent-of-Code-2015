/**
 * Created by Michael Root on 12/20/2015.
 */
var assert = require('assert');
describe('Day01', function () {
    describe('Part 1', function () {
        it('should return 138', function () {
            var result = require('../Day01/app.js').solvePuzzle();
            assert.equal(result, 138);
        });
    });

    describe('Part 2', function () {
        it('should return 1771', function () {
            var result = require('../Day01/app.js').solvePuzzle(true);
            assert.equal(result, 1771);
        });
    });
});

describe('Day17', function () {
    describe('Part 1', function () {
        it('should return 4372', function () {
            this.timeout(6500);
            var result = require('../Day17/app.js').solvePuzzle();
            assert.equal(result, 4372);
        });
    });
    describe('Part 2', function () {
        it('should return 4', function () {
            var result = require('../Day17/app.js').solvePuzzle(true);
            assert.equal(result, 4);
        });
    });
});

describe('Day18', function () {
    describe('Part 1', function () {
        it('should return 768', function () {
            var result = require('../Day18/app.js').solvePuzzle();
            assert.equal(result, 768);
        });
    });
    describe('Part 2', function () {
        it('should return 781', function () {
            var result = require('../Day18/app.js').solvePuzzle(true);
            assert.equal(result, 781);
        });
    });
});

describe('Day19', function () {
    describe('Part 1', function () {
        it('should return 535', function () {
            var result = require('../Day19/app.js').solvePuzzle();
            assert.equal(result, 535);
        });
    });
});