#!/usr/bin/env NODE_ENV=production node
const initialState = require('fs').readFileSync('./sample.txt', 'utf-8')
  .split('\n')
  .filter(line => line)
  .map(line => line.split(''))
  .flat()


function evolve (pocketDimension, min, max) {
  const { matrix, size, cycle, cycles, dimensions } = pocketDimension
  const { length, height, width } = dimensions

  // copy current state
  const currentState = Array(size)
  for (let i = 0; i < size; i++) {
    currentState[i] = matrix[i]
  }

  // apply filter
  const start = (length - cycles) - (cycle + 1)
  const stop = (length - cycles) + (cycle + 1)
  const offset = height * width

  for (let i = start; i < stop; i++) {
    const z = (i - (i % length)) / length
    const x = i % width
    const y = ((i - x) / width) * width

    const state = matrix[z + y + x]

    const pz = z - offset
    const px = x - 1
    const py = ((i - px) / width) * width

    const nz = z + offset
    const nx = x + 1
    const ny = ((i - nx) / width) * width

    // (3^3) - 1 = 27
    const neighbours = [
      /* previous pocket: z - 1*/
      currentState[pz + py + px] ?? '.',  // (z - 1, y - 1, x - 1)
      currentState[pz + py + x] ?? '.',   // (z - 1, y - 1, x)
      currentState[pz + py + nx] ?? '.',  // (z - 1, y - 1, x + 1)

      currentState[pz + y + px] ?? '.',  // (z - 1, y, x - 1)
      currentState[pz + y + x] ?? '.',   // (z - 1, y, x)
      currentState[pz + y + nx] ?? '.',  // (z - 1, y, x + 1)

      currentState[pz + ny + px] ?? '.',  // (z - 1, y + 1, x - 1)
      currentState[pz + ny + x] ?? '.',   // (z - 1, y + 1, x)
      currentState[pz + ny + nx] ?? '.',  // (z - 1, y + 1, x + 1)

      /* current pocket: z - 1*/
      currentState[z + py + px] ?? '.',  // (z, y - 1, x - 1)
      currentState[z + py + x] ?? '.',   // (z, y - 1, x)
      currentState[z + py + nx] ?? '.',  // (z, y - 1, x + 1)

      currentState[z + y + px] ?? '.',  // (z, y, x - 1)
                                        // (z, y, x - 1)
      currentState[z + y + nx] ?? '.',  // (z, y, x + 1)

      currentState[z + ny + px] ?? '.',  // (z, y + 1, x - 1)
      currentState[z + ny + x] ?? '.',   // (z, y + 1, x)
      currentState[z + ny + nx] ?? '.',  // (z, y + 1, x + 1)

      /* next pocket: z - 1*/
      currentState[nz + py + px] ?? '.',  // (z + 1, y - 1, x - 1)
      currentState[nz + py + x] ?? '.',   // (z + 1, y - 1, x)
      currentState[nz + py + nx] ?? '.',  // (z + 1, y - 1, x + 1)

      currentState[nz + y + px] ?? '.',  // (z + 1, y, x - 1)
      currentState[nz + y + x] ?? '.',   // (z + 1, y, x)
      currentState[nz + y + nx] ?? '.',  // (z + 1, y, x + 1)

      currentState[nz + ny + px] ?? '.',  // (z + 1, y + 1, x - 1)
      currentState[nz + ny + x] ?? '.',   // (z + 1, y + 1, x)
      currentState[nz + ny + nx] ?? '.',  // (z + 1, y + 1, x + 1)
    ]

    let active = 0
    for (let i = 0, n = neighbours.length; i < n; i++) {
      active = active + (neighbours[i] === '#' ? 1 : 0)
    }
    /*
      - If a cube is active and exactly {min} or {max} of its neighbors are also active,
        the cube remains active. Otherwise, the cube becomes inactive.

      - If a cube is inactive but exactly {max} of its neighbors are active,
        the cube becomes active. Otherwise, the cube remains inactive.
    */
    let newState = state
    if ((state === '#') && (active < min || max < active)) {
      newState = '.'
    }

    if ((state === '.') && (active === max)) {
      newState = '#'
    }

    if (newState !== state) {
      matrix[z + y + x] = newState
    }
  }

  pocketDimension.cycle = pocketDimension.cycle + 1
}

// len(11) - cycles(6)
function printPocketDimension (pocketDimension, pocket) {
  const { matrix, cycles, dimensions } = pocketDimension
  const { length, height, width } = dimensions

  const offset = length - cycles
  const size = (height * width)
  const z = (pocket + offset) * size
  for (let x = z, n = z + size; x < n; x = x + width) {
    console.log(matrix.slice(x, x + width))
  }
}

function createPocketDimension (initialState,  cycles) {
  const length = (cycles * 2) - 1
  const height = Math.sqrt(initialState.length)
  const width = height

  const size = length * height * width
  const matrix = Array(size)

  // initialize all values to '.'
  for (let i = 0; i < size; i++) {
    matrix[i] = '.'
  }

  /*
  Explanation for the corect pocket inx is the following:
    ((6 * 2) - 1) - 6 = 5

  Since 0..4 represents the pockets:
    -5, -4, -3, -2 and -1
  */

  // setup pocket 0
  const offset = length - cycles
  const slice = (height * width)
  const z = (0 + offset) * slice
  for (let i = 0, n = i + slice; i < n; i++) {
    x = i % width
    y = ((i - x) / width) * width
    matrix[z + y + x] = initialState[i]
  }

  return {
    size,
    cycle: 0,
    cycles,
    dimensions: {
      length,
      height,
      width
    },
    matrix
  }
}

function runSimulationPartOne () {
  const pocketDimension = createPocketDimension(initialState, 6)
  evolve(pocketDimension, 2, 3)
  printPocketDimension(pocketDimension, 0)
}


runSimulationPartOne()
