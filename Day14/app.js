/**
 * Created by Michael Root on 12/15/2015.
 */
var fs = require('fs');
var split = require('split');

var EventEmitter = require('events').EventEmitter;

var NUM_SECONDS = 2503;
var PATTERN = /(\w+) can fly (\d+) .* for (\d+) seconds, but then must rest for (\d+) seconds./;

var raceSimulator = new EventEmitter();
var racers = [];

function Racer(params) {
    var _data = params;
    var flyTime = _data.flyTime;
    var position = 0;
    var coolDown = 0;
    var points = 0;

    this.updatePosition = function () {
        if (flyTime) {
            position += _data.speed;
            flyTime--;
        } else {
            coolDown++;
            if (coolDown === _data.coolDown) {
                flyTime = _data.flyTime;
                coolDown = 0;
            }
        }
    };

    this.updatePoints = function (distance) {
        if (distance === position) {
            console.log(_data.name + ' in the lead');
            points++;
        }
    };

    this.getName = function () {
        return _data.name;
    }


    this.getPosition = function () {
        return position;
    }

    this.getPoints = function () {
        return points;
    }
}

function parseLine(input) {
    var matches = input.match(PATTERN);
    var racer = new Racer({
        name: matches[1],
        speed: Number.parseInt(matches[2]),
        flyTime: Number.parseInt(matches[3]),
        coolDown: Number.parseInt(matches[4])
    });

    racers.push(racer);

    raceSimulator.on('secondTick', racer.updatePosition);
    raceSimulator.on('secondEnd', racer.updatePoints);
}

function getLeader(beatsLeader) {
    var leader = racers[0];
    racers.forEach(function (racer) {
        if (beatsLeader(racer, leader)) {
            leader = racer;
        }
    });
    return leader;
}

function simulateRace() {

    for (var i = 0; i < NUM_SECONDS; ++i) {
        raceSimulator.emit('secondTick');
        var leader = getLeader(function (racer, leader) {
            return racer.getPosition() > leader.getPosition();
        });
        raceSimulator.emit('secondEnd', leader.getPosition());
    }

    var winner = getLeader(function (racer, leader) {
        return racer.getPoints() > leader.getPoints();
    });

    console.log("Winner: " + winner.getName() +
        ' Distance: ' + winner.getPosition() +
        'Points: ' + winner.getPoints());
}


fs.createReadStream('input.txt', 'utf-8')
    .pipe(split())
    .on('data', parseLine)
    .on('end', simulateRace);