// @see https://stackoverflow.com/questions/1436438/how-do-you-set-clear-and-toggle-a-single-bit-in-javascript
// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators#Binary_bitwise_operators

function parseSeatRow (chars) {
  // return 0
  //   | (chars[0] === 'B' ? 1 : 0) << 6 // set bit pos 6 = 64
  //   | (chars[1] === 'B' ? 1 : 0) << 5 // set bit pos 5 = 32
  //   | (chars[2] === 'B' ? 1 : 0) << 4 // set bit pos 4 = 16
  //   | (chars[3] === 'B' ? 1 : 0) << 3 // set bit pos 3 =  8
  //   | (chars[4] === 'B' ? 1 : 0) << 2 // set bit pos 2 =  4
  //   | (chars[5] === 'B' ? 1 : 0) << 1 // set bit pos 1 =  2
  //   | (chars[6] === 'B' ? 1 : 0) << 0 // set bit pos 0 =  1

  // can also be expressed as:
  /*
  return letters.split('').reverse()
    .map(char => char === 'B' ? 1 : 0)
    .reduce((acc, bit, index) => acc | bit << index, 0)
  */

  const charCodes = {
    'B': 66, // on
    'F': 70  // off
  }

  /*
    B   = 66 = 1000010 ; on
    F   = 70 = 1000110 ; off
    XOR ---------------
        = 4 = 0000100
        = 4 >> 2 = 1
  */
  return 0
    | (charCodes[chars[0]] ^ 70) >> 2 << 6 // set bit pos 6 = 64
    | (charCodes[chars[1]] ^ 70) >> 2 << 5 // set bit pos 5 = 32
    | (charCodes[chars[2]] ^ 70) >> 2 << 4 // set bit pos 4 = 16
    | (charCodes[chars[3]] ^ 70) >> 2 << 3 // set bit pos 3 =  8
    | (charCodes[chars[4]] ^ 70) >> 2 << 2 // set bit pos 2 =  4
    | (charCodes[chars[5]] ^ 70) >> 2 << 1 // set bit pos 1 =  2
    | (charCodes[chars[6]] ^ 70) >> 2 << 0 // set bit pos 0 =  1
}

function parseSeatColumn (chars) {
  // return 0
  //   | (chars[0] === 'R' ? 1 : 0) << 2 // set bit pos 2 = 4
  //   | (chars[1] === 'R' ? 1 : 0) << 1 // set bit pos 1 = 2
  //   | (chars[2] === 'R' ? 1 : 0) << 0 // set bit pos 0 = 1

  // can also be expressed as:
  /*
  return letters.split('').reverse()
    .map(char => char === 'R' ? 1 : 0)
    .reduce((acc, bit, index) => acc | bit << index, 0)
  */

  const charCodes = {
    'R': 82, // on
    'L': 76  // off
  }

  /*
    R   = 82 = 1010010 ; on
    L   = 76 = 1001100 ; off
    XOR ---------------
        = 30 = 0011110
        = 30 >> 4 = 1
  */
  return 0
    | (charCodes[chars[0]] ^ 76) >> 4 << 2 // set bit pos 2 = 4
    | (charCodes[chars[1]] ^ 76) >> 4 << 1 // set bit pos 1 = 2
    | (charCodes[chars[2]] ^ 76) >> 4 << 0 // set bit pos 0 = 1
}

function parseSeat (line) {
  const row = parseSeatRow(line.substr(0, 7))
  const column = parseSeatColumn(line.substr(7, 3))
  const seatId = (row * 8) + column

  return { row, column, seatId }
}

function main () {
  const lines = require('fs').readFileSync('./input.txt', 'utf-8').split('\n').filter(v => v)
  const seats = lines.map(line => parseSeat(line))
  const seatIds = seats.map(seat => seat.seatId).sort((a, b) => b - a)
  const mySeatId = seatIds.find((seatId, index) => seatIds[index + 1] === seatId - 2) - 1

  console.log(`highest seat id: ${seatIds[0]}`)
  console.log(`my seat id: ${mySeatId}`)
}

main()
