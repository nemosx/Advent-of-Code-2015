/**
 * Created by Michael Root on 12/7/2015.
 */
var circuit = require('./circuit');

var wireX = circuit.createWire('x', 123);
var wireY = circuit.createWire('y', 456);

console.log(wireX.source());
console.log(wireY.source());

var bitwiseAnd = function (wires) {
    return wires[0].source() & wires[1].source();
};

var gate = circuit.createGate(bitwiseAnd).
connectWire(wireX).
connectWire(wireY);

console.log(gate.source());

/**
 *
 * bn RSHIFT 2 -> bo
 * lf RSHIFT 1 -> ly
 * fo RSHIFT 3 -> fq
 * cj OR cp -> cq
 * fo OR fz -> ga
 * t OR s -> u
 * NOT wire -> wire
 */

// left of the arrow is SOURCE to

//parse left of -->

//possibilities
// wire AND wire
// wire OR wire
// wire LSHIFT number
// wire RSHIFT number
// NOT wire
// number

//check is wire id is in wire map
// NO?
// create wire L (no source)
// add wire to global wire map

//check if wireR id is in wire map?
//yes ?
// hold onto wire

// create gate
// push wire left and right right

// check right side??
// does it exist ?
// no? create wire with id, update source with gate, add to wire map
//

// check if wire id is in map ?
// yes? hold onto wire
// no? create wire and add to map
// create LSFHIT gate and add wire


// check if id of right exists in map ?
// if NO

//create wire with ID and source and put it in map

//if YES

//grab wire from map and set source to RIGHT

