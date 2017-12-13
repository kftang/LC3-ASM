const operations = ['add', 'and', 'br', 'brn', 'brz', 'brp', 'brnz', 'brnp', 'brzp', 'brnzp', 'jmp', 'jsr', 'jsrr', 'ld', 'ldi', 'ldr', 'lea', 'not', 'ret', 'rti', 'st', 'sti', 'str', 'trap', 'getc', 'out', 'puts', 'in', 'halt']
const ops = {
  add: {
    opcode: 0b0001,
    args: [['R', 'R', '000', 'R'], ['R', 'R', '1', 'D5']],
  },
  and: {
    opcode: 0b0101,
    args: [['R', 'R', '000', 'R'], ['R', 'R', '1', 'D5']],
  },
  br: {
    opcode: 0b0000,
    args: ['*','*','*', 'D9'],
  },
  jmp: {
    opcode: 0b1100,
    args: ['000','R', '000000'],
  },
  jsr: {
    opcode: 0b0100,
    args: ['1','D11'],
  },
  jsrr: {
    opcode: 0b0100,
    args: ['000', 'R', '000000'],
  },
  ld: {
    opcode: 0b0010,
    args: ['R', 'D9'],
  },
  ldi: {
    opcode: 0b1010,
    args: ['R', 'D9'],
  },
  ldr: {
    opcode: 0b0110,
    args: ['R', 'R', 'D6'],
  },
  lea: {
    opcode: 0b1110,
    args: ['R', 'D9'],
  },
  not: {
    opcode: 0b1001,
    args: ['R', 'R', '111111'],
  },
  ret: {
    opcode: 0b1100,
    args: ['000111000000'],
  },
  rti: {
    opcode: 0b1000,
    args: ['000000000000'],
  },
  st: {
    opcode: 0b0011,
    args: ['R', 'D9'],
  },
  sti: {
    opcode: 0b1011,
    args: ['R', 'D9'],
  },
  str: {
    opcode: 0b0111,
    args: ['R', 'R', 'D6'],
  },
  trap: {
    opcode: 0b1111,
    args: ['0000', 'D8']
  },
  getc: { // x20
    opcode: 0b1111,
    args: ['000000100000'],
  },
  out: { // x21
    opcode: 0b1111,
    args: ['000000100001'],
  },
  puts: { // x22
    opcode: 0b1111,
    args: ['000000100010'],
  },
  in: { // x23
    opcode: 0b1111,
    args: ['000000100011'],
  },
  halt: { // x25
    opcode: 0b1111,
    args: ['000000100101'],
  },
}
const psuedos = ['.fill', '.blkw', '.stringz', '.orig', '.end']
const symtable = {};
const out = [];
let lastLineLabel = false;

//Remove all comments and uneccesary spacing
function sanitize(code) {
  code = code.replace(/$\s+|\s+;.*|;.*/gm, '');
  return code.replace(/\s*,\s*/gm, ',');
}

function getStart(lines) {
  const firstLine = lines.pop()
  if (!firstLine.match(/\.orig.*/i)) {
    throw fail(`Expected .ORIG but found ${firstLine} instead`, 1); // Expected .orig found...
  } else if (firstLine.match(/\.orig\s+x?\d+/i)) {
    const offset = firstLine.match(/\.orig\s+x?(\d+)/i)[1]|0;
    if (offset > 2**16) {
      throw fail(`${offset} can not be represented as an unsigned number in 16 bits`);
    }
    return offset;
  }
}

function checkEnd(line) {
  return line.match(/^.end$/i);
}

function translate(code) {
  code = sanitize(code);
  const lines = code.split(/\n+|\r+/);
  const startOffset = getStart(lines);
  while (!checkEnd(lines[lines.length - 1])) {
    
  }
}

// Return machine code of an instruction
function binify(instruction, line) {
  const parts = instruction.split(/\s+|,\s*|;.*/);
  // If the first part is not an instruction
  if (!operations.includes(parts[0].toLowerCase())) {
    // Label on line by itself
    if (parts.length == 1) {
      if (lastLineLabel) {
        // Can't have two labels in a row
        throw fail('');
        return false;
      }
      lastLineLabel = true;
      symbolize(parts[0], line)
    } else {
      lastLineLabel = false;
      symbolize(parts[0], line);
    }
    return true;
  }
}

// create symbol table
function symbolize(label, line) {
  if (label) {
    throw fail(`Invalid label '${label}'`);
  }
  if (symtable[label]) {
    throw fail('Duplicate label');
  } else {
    symtable[label] = line;
  }
}

function replaceLater(line) {
  
}
