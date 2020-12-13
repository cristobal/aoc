#!/usr/bin/env node
const moves = require('fs').readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .filter(line => line)
  .map(line => {
    const action = line.substr(0, 1)
    const value = Number.parseInt(line.slice(1).trim())
    return { action, value }
  })

/*
  Boat moves in these directions.
    N
  W * E -> boats starts facing east
    S

  Rotations are L or R
*/
const boat = {
  direction: 'E',
  pos: {
    x: 0,
    y: 0
  }
}

// Possible rotations are [ 90, 180, 270 ]
const rotations = {
  L: {
    E: ['N', 'W', 'S'],
    N: ['W', 'S', 'E'],
    W: ['S', 'E', 'N'],
    S: ['E', 'N', 'W']
  },
  R: {
    E: ['S', 'W', 'N'],
    S: ['W', 'N', 'E'],
    W: ['N', 'E', 'S'],
    N: ['E', 'S', 'W']
  }
}

for (const move of moves) {
  // rotate boat in the possible direction
  if (move.action === 'L' || move.action === 'R') {
    boat.direction = rotations[move.action][boat.direction][(move.value / 90) - 1]
    continue
  }

  // update coords
  const direction = move.action === 'F'
    ? boat.direction
    : move.action

  switch (direction) {
    case 'N': boat.pos.y = boat.pos.y + move.value; break
    case 'W': boat.pos.x = boat.pos.x + (move.value * -1); break
    case 'E': boat.pos.x = boat.pos.x + move.value; break
    case 'S': boat.pos.y = boat.pos.y + (move.value * -1); break
  }
}

console.log({ boat })
console.log(Math.abs(boat.pos.x) + Math.abs(boat.pos.y))
