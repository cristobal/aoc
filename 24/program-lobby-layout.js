#!/usr/bin/env NODE_ENV=production node
const tilePattern = /nw|ne|sw|se|e|w/g
const lines = require('fs').readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .filter(line => line)
  .map(
    line => Array.from(line.matchAll(tilePattern)).map(result => result[0])
  )

function walk (line) {
  const coords = { x: 0, y: 0 }
  for (const direction of line) {
    switch (direction) {
      case 'w': {
        coords.x += -2
        break
      }
      case 'nw': {
        coords.x += -1
        coords.y += 1
        break
      }
      case 'sw': {
        coords.x += -1
        coords.y += -1
        break
      }
      case 'e': {
        coords.x += 2
        break
      }
      case 'ne': {
        coords.x += 1
        coords.y += 1
        break
      }
      case 'se': {
        coords.x += 1
        coords.y += -1
        break
      }
    }
  }

  return coords
}

const tiles = new Map()
function update (coords) {
  const key = `<${coords.x},${coords.y}>`
  tiles.set(
    key, (tiles.get(key) ?? 0) + 1
  )
}

for (const line of lines) {
  update(walk(line))
}

const keys = Array.from(tiles.keys())
const values = keys.map(key => tiles.get(key))
const black = values.filter(v => (v % 2) === 1)
const white = values.filter(v => (v % 2) === 0)


console.log(`Part one - total black side up: <${black.length}>`)
