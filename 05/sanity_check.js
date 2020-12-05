
function parseSeatRow (letters) {
  const values = [
    letters[0] === 'B' ? 64 : 0,
    letters[1] === 'B' ? 32 : 0,
    letters[2] === 'B' ? 16 : 0,
    letters[3] === 'B' ? 8 : 0,
    letters[4] === 'B' ? 4 : 0,
    letters[5] === 'B' ? 2 : 0,
    letters[6] === 'B' ? 1 : 0
  ]

  return values.reduce((acc, value) => value | acc, 0)
}

function parseSeatColumn (letters) {
  const values = [
    letters[0] === 'R' ? 4 : 0,
    letters[1] === 'R' ? 2 : 0,
    letters[2] === 'R' ? 1 : 0
  ]

  return values.reduce((acc, value) => value | acc, 0)
}

function parseSeat (line) {
  const row = parseSeatRow(line.substr(0, 7))
  const column = parseSeatColumn(line.substr(7, 3))
  const seatId = (row * 8) + column

  return { row, column, seatId }
}

async function main () {
  const lines = require('fs').readFileSync('./input.txt', 'utf-8').split('\n').filter(v => v)
  const seats = lines.map(line => parseSeat(line))
  const seatIds = seats.map(seat => seat.seatId).sort((a, b) => b - a)
  const mySeatId = seatIds.find((seatId, index) => seatIds[index + 1] === seatId - 2) - 1

  console.log(`highest seat id: ${seatIds[0]}`)
  console.log(`my seat id: ${mySeatId}`)
}

main()
