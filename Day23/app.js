/**
 * Created by Michael Root on 2/18/2017.
 */
const fs = require('fs');
const instructions = fs.readFileSync('input.txt', 'utf-8').split('\n');

const REGISTERS = {
    a: 1,
    b: 0
};

const instructionSet = {
    inc: function (register) {
        REGISTERS[register]++;
    },
    tpl: function (register) {
        REGISTERS[register] *= 3;
    },
    hlf: function (register) {
        REGISTERS[register] = Math.trunc(REGISTERS[register] / 2);
    },
    jmp: function(offset) {
        return parseInt(offset);
    },
    jie: function(register, offset) {
        if (REGISTERS[register] !== 0 && REGISTERS[register] % 2 === 0) {
            return this.jmp(offset);
        }
        return 1;
    },
    jio: function(register, offset) {
        if(REGISTERS[register] === 1) {
            return this.jmp(offset);
        }
        return 1;
    }
};

const HLF_TPL_INC_REGEX = /(hlf|tpl|inc) (a|b)/;
const JMP_REGEX = /(jmp) (.*)/;
const JIEO_REGEX = /(jie|jio) (a|b), (.*)/;

function isValidInstruction(instructionIndex) {
    return instructionIndex >= 0 && instructionIndex < instructions.length;
}

function executeInstruction(instructionIndex) {
    let instruction = instructions[instructionIndex];
    let matches = HLF_TPL_INC_REGEX.exec(instruction);

    if (matches) {
        const [, inst, register] = matches;

        instructionSet[inst](register);

        return ++instructionIndex;
    }else if(matches = JMP_REGEX.exec(instruction)) {
        const [, inst, offset] = matches;

        return instructionSet[inst](offset) + instructionIndex;
    }else if (matches = JIEO_REGEX.exec(instruction)) {
        const [, inst, register, offset] = matches;

        return instructionSet[inst](register, offset) + instructionIndex;
    }
}

let currentInstructionIndex = 0;

while (isValidInstruction(currentInstructionIndex)) {
    currentInstructionIndex = executeInstruction(currentInstructionIndex);
}

console.log('Register b value: %d', REGISTERS.b);