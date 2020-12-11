#!/usr/bin/env node
const grid = require('fs').readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .filter(line => line)
  .map(line => line.split(''))

const height = grid.length
const width = grid[0].length

const gridValue =
  (g, y, x) => {
    if (y < 0 || y >= height) {
      return 'X'
    }

    if (x < 0 || x >= width) {
      return 'X'
    }

    return g[y][x]
  }

const copyGrid =
  g => [].concat(g.map(r => r.concat()))

let prev = copyGrid(grid)
let curr = copyGrid(grid)

while (true) {
  let changes = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const v = prev[y][x]

      // floor continue
      if (v === '.') {
        continue
      }

      let m = [
        // 0, 1, 2
        gridValue(prev, y - 1, x - 1),
        gridValue(prev, y - 1, x),
        gridValue(prev, y - 1, x + 1),

        // 3, 5
        gridValue(prev, y, x - 1),
        gridValue(prev, y, x + 1),

        // 6, 7, 8
        gridValue(prev, y + 1, x - 1),
        gridValue(prev, y + 1, x),
        gridValue(prev, y + 1, x + 1)
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
      if ((v === '#') && (occupied >= 4)) {
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

// for (const row of curr) {
//   console.log(row.join(''))
// }

const availableSeats = curr.reduce((acc, row) => acc + row.filter(v => v === '#').length, 0)
console.log({ availableSeats })
