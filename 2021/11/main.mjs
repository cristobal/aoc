import fs from 'fs/promises'

function readData() {
  return fs.readFile('./input.txt', 'utf-8')
    .then(
      contents => contents.split('\n')
        .filter(line => line)
        .map(line => line.split(''))
        .flat()
        .map(arg => Number(arg))
    )
}

const WIDTH  = 10
const HEIGHT = 10
const NEIGHBOURS_INDEXES = (() => {
  const size = WIDTH * HEIGHT
  const indexes = Array(size).fill([])
  const leftVal =
    val => (
      val % WIDTH === 0
        ? -1
        : val - 1
    )
  const rightVal =
    val => (
      (val + 1) % WIDTH === 0
        ? -1
        : val + 1
    )

  for (let i = 0; i < size; i++) {
    const north = i - WIDTH
    const northWest = leftVal(north)
    const northEast = rightVal(north)

    const south = i + WIDTH
    const southWest = leftVal(south)
    const southEast = rightVal(south)

    const west = leftVal(i)
    const east = rightVal(i)

    indexes[i] = [
      northWest, north, northEast,
      west,  /* center, */  east,
      southWest, south, southEast
    ].filter(index => index >= 0 && index < size)
  }

  return indexes
})()

const increase =
  (input) => {
    for (let i = 0, size = input.length; i < size; i++) {
      input[i] = input[i] + 1
    }
  }

const flash =
  (input) => {
    let sum = 0
    let index = input.indexOf(10)
    while (index >= 0) {
      sum += 1
      input[index] = 0
      for (const neighbour of NEIGHBOURS_INDEXES[index]) {
        if (input[neighbour] === 0) {
          continue
        }

        if ((input[neighbour] + 1) > 10) {
          continue
        }

        input[neighbour]++
      }

      index = input.indexOf(10)
    }

    return sum
  }

async function main() {
  const input = await readData()

  const steps = 100
  let sum  = 0
  for (let i = 0; i < steps; i++) {
    increase(input)
    sum += flash(input)
  }

  console.log(`Quiz1: ${sum}`)

  let step = 100
  do {
    increase(input)
    flash(input)
    step++
  } while (input.filter(i => i === 0).length !== 100)
  console.log(`Quiz2: ${step}`)
}

main()
