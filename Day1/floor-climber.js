/**
 * Created by Michael Root on 12/6/2015.
 */
module.exports.init = function () {
    var currentFloor = 0;

    function ascendFloor() {
        currentFloor++;
    }

    function descendFloor() {
        currentFloor--;
    }

    function getCurrentFloor() {
        return currentFloor;
    }

    return {
        ascendFloor: ascendFloor,
        descendFloor: descendFloor,
        currentFloor: getCurrentFloor
    };
};