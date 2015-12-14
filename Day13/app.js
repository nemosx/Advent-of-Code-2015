/**
 * Created by Michael Root on 12/13/2015.
 */
var fs = require('fs');
var split = require('split');
var permutationEngine = require('permutation-engine');

var PREFERENCE_PATTERN = /(\w+) .*(lose|gain) (\d+) .*next to (\w+)/
var guestSeatPreferenceMap = {};

function processSeatPreferences(seatPreference) {
    var matches = seatPreference.match(PREFERENCE_PATTERN);
    var guestPreference = guestSeatPreferenceMap[matches[1]] || {};

    guestPreference[matches[4]] = matches[2] === 'gain' ? Number.parseInt(matches[3]) : -Number.parseInt(matches[3]);
    guestSeatPreferenceMap[matches[1]] = guestPreference;
}

function calculateOptimalSeatingArrangement() {
    var guests = Object.keys(guestSeatPreferenceMap);

    var engine = new permutationEngine(guests.length);
    var length = engine.perm2index(engine.lastPerm());

    var seatingArrangement;
    var totalHappiness = 0;

    var optimalHappiness = Number.MIN_VALUE;

    for (var i = 0; i < length; ++i) {
        seatingArrangement = engine.index2perm(i);
        totalHappiness = calculateSeatingArrangementHappiness(seatingArrangement, guests);
        if (totalHappiness > optimalHappiness) {
            optimalHappiness = totalHappiness;
        }
    }

    console.log('optimal happiness' + optimalHappiness);
}

function calculateSeatingArrangementHappiness(seatingArrangement, guests) {
    var arrangementHappiness = 0;

    for (var j = 0; j < seatingArrangement.length; ++j) {

        var guestLeftIndex = (j - 1) < 0 ? (j - 1) + seatingArrangement.length : (j - 1);
        var guestLeftName = guests[(seatingArrangement[guestLeftIndex] - 1)];
        var currentGuestName = guests[seatingArrangement[j] - 1];
        var guestRightName = guests[seatingArrangement[(j + 1) % seatingArrangement.length] - 1];

        arrangementHappiness += guestSeatPreferenceMap[currentGuestName][guestLeftName] +
            guestSeatPreferenceMap[currentGuestName][guestRightName];
    }
    return arrangementHappiness;
}

fs.createReadStream('guest-list.txt', 'utf-8')
    .pipe(split())
    .on('data', processSeatPreferences)
    .on('end', calculateOptimalSeatingArrangement)