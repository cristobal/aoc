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
   -1,1  N  1,1
       W * E -> boats starts facing east
  -1,-1  S  1,-1

  Rotations are L or R
*/


const waypoint = {
  west_east: 10,
  north_south: 1,
  pos: {
    x: 0,
    y: 0
  }
}

let moveX = 0
let moveY = 1

const rad =
  degrees => degrees * Math.PI / 180

for (const move of moves) {
  if (move.action === 'L') {
    const west_east = Math.cos(rad(move.value)) * waypoint.west_east - Math.sin(rad(move.value)) * waypoint.north_south
    const north_south = Math.sin(rad(move.value)) * waypoint.west_east + Math.cos(rad(move.value)) * waypoint.north_south

    waypoint.west_east = Math.round(west_east)
    waypoint.north_south = Math.round(north_south)
    continue
  }

  if (move.action === 'R') {
    const west_east = Math.cos(rad(-move.value)) * waypoint.west_east - Math.sin(rad(-move.value)) * waypoint.north_south
    const north_south = Math.sin(rad(-move.value)) * waypoint.west_east + Math.cos(rad(-move.value)) * waypoint.north_south

    waypoint.west_east = Math.round(west_east)
    waypoint.north_south = Math.round(north_south)
    continue
  }

  if (move.action === 'F') {
    waypoint.pos.x = waypoint.pos.x + (move.value * waypoint.west_east)
    waypoint.pos.y = waypoint.pos.y + (move.value * waypoint.north_south)
    continue
  }

  if (move.action === 'W' || move.action === 'E') {
    waypoint.west_east = waypoint.west_east + (move.value * (move.action === 'W' ? -1 : 1))
    continue
  }

  if (move.action === 'N' || move.action === 'S') {
    waypoint.north_south = waypoint.north_south + (move.value * (move.action === 'S' ? -1 : 1))
    continue
  }
}

console.log('we', waypoint.west_east, 'ns', waypoint.north_south, waypoint.pos)
console.log(Math.abs(waypoint.pos.x) + Math.abs(waypoint.pos.y))
console.log()
