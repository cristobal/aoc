#!/usr/bin/env node
const board = require('fs').readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .filter(line => line)
  .map(line => line.split(''))

const boardHeight = board.length
const boardWidth = board[0].length

function getBoardValueNW (board, y, x) {
  let depth = 0
  for (let dy = y - 1, dx = x - 1; dy >= 0 && dx >= 0; dy--, dx--) {
    const value = board[dy][dx]
    if (value === '#' || value === 'L') {
      return value
    }
    depth++

    if (depth >= kernelDepth) {
      break
    }
  }

  return ''
}

function getBoardValueN (board, y, x) {
  let depth = 0
  for (let dy = y - 1; dy >= 0; dy--) {
    const value = board[dy][x]
    if (value === '#' || value === 'L') {
      return value
    }
    depth++

    if (depth >= kernelDepth) {
      break
    }
  }

  return ''
}

function getBoardValueNE (board, y, x) {
  let depth = 0
  for (let dy = y - 1, dx = x + 1; dy >= 0 && dx < boardWidth; dy--, dx++) {
    const value = board[dy][dx]
    if (value === '#' || value === 'L') {
      return value
    }
    depth++

    if (depth >= kernelDepth) {
      break
    }
  }

  return ''
}

function getBoardValueW (board, y, x) {
  let depth = 0
  for (let dx = x - 1; dx >= 0; dx--) {
    const value = board[y][dx]
    if (value === '#' || value === 'L') {
      return value
    }
    depth++

    if (depth >= kernelDepth) {
      break
    }
  }

  return ''
}

function getBoardValueE (board, y, x) {
  let depth = 0
  for (let dx = x + 1; dx < boardWidth; dx++) {
    const value = board[y][dx]
    if (value === '#' || value === 'L') {
      return value
    }
    depth++

    if (depth >= kernelDepth) {
      break
    }
  }

  return ''
}

function getBoardValueSW (board, y, x) {
  let depth = 0
  for (let dy = y + 1, dx = x - 1; dy < boardHeight && dx >= 0; dy++, dx--) {
    const value = board[dy][dx]
    if (value === '#' || value === 'L') {
      return value
    }
    depth++

    if (depth >= kernelDepth) {
      break
    }
  }

  return ''
}

function getBoardValueS (board, y, x) {
  let depth = 0
  for (let dy = y + 1; dy < boardHeight; dy++) {
    const value = board[dy][x]
    if (value === '#' || value === 'L') {
      return value
    }
    depth++

    if (depth >= kernelDepth) {
      break
    }
  }

  return ''
}

function getBoardValueSE (board, y, x) {
  let depth = 0
  for (let dy = y + 1, dx = x + 1; dy < boardHeight && dx < boardWidth; dy++, dx++) {
    const value = board[dy][dx]
    if (value === '#' || value === 'L') {
      return value
    }
    depth++

    if (depth >= kernelDepth) {
      break
    }
  }

  return ''
}


const copyGrid =
  g => [].concat(g.map(r => r.concat()))

let prev = copyGrid(board)
let curr = copyGrid(board)

// Part 1
// const adjacentThreshold = 4
// const kernelDepth = 1

// Part 2
const adjacentThreshold = 5
const kernelDepth = Number.MAX_SAFE_INTEGER

while (true) {
  let changes = 0

  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      const v = prev[y][x]

      // floor continue
      if (v === '.') {
        continue
      }

      let m = [
        /*
          NW N NE
           W * E
          SW S SE
        */

        // 0, 1, 2
        getBoardValueNW(prev, y, x), //
        getBoardValueN(prev, y, x),
        getBoardValueNE(prev,  y, x),

        // 3, 5
        getBoardValueW(prev, y, x),
        getBoardValueE(prev, y, x),

        // 6, 7, 8
        getBoardValueSW(prev, y, x),
        getBoardValueS(prev, y, x),
        getBoardValueSE(prev, y, x)
      ]

      const occupied = m.filter(v => v === '#').length
      // If a seat is empty (L) and there are no occupied seats adjacent to it,
      // the seat becomes occupied.
      if ((v === 'L') && (occupied === 0)) {
        curr[y][x] = '#'
        changes++
        continue
      }

      // If a seat is occupied (#) and four or more seats adjacent to it are
      // also occupied, the seat becomes empty.
      if ((v === '#') && (occupied >= adjacentThreshold)) {
        curr[y][x] = 'L'
        changes++
        continue
      }
    }
  }
  prev = copyGrid(curr)

  if (changes === 0) {
    break
  }
}

const seatsTaken = curr.reduce((acc, row) => acc + row.filter(v => v === '#').length, 0)
console.log({ seatsTaken })
