#!/usr/bin/env node
const numbers = require('fs').readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .filter(line => line)
  .map(line => Number.parseInt(line))

const numbersSize = numbers.length

const window = []
const windowSize = 25

function init_window () {
  for (let x = 1; x < windowSize; x++) {
    for (let y = 0; y < x; y++) {
      window.push(numbers[x] + numbers[y])
    }
  }
}

let windowStep = windowSize
function slide () {
  if (windowStep >= numbersSize - 1) {
    return
  }

  // remove all sums for first number
  {
    let y = windowSize
    let width = windowSize - 1
    let index = window.length - width
    for (;--y; width--, index -= width) {
      window.splice(index, 1)
    }
  }

  // append all sums for next number
  {
    let x = windowStep
    let y = windowStep - (windowSize - 1)
    for (; y < x; y++) {
      window.push(numbers[x] + numbers[y])
    }
  }
  windowStep++
}

function print_window () {
  let index = 0
  for (let y = 0, width = 1; y < (windowSize - 1); y++, width++) {
    const values = []
    for (let x = 0; x < width; x++) {
      values.push(window[index++])
    }
    console.log(values.join(' '))
  }
}

function findFirstNumber () {
  init_window()
  // print_window()

  let value
  for (let i = windowStep; i < (numbersSize - 1); i++) {
    value = numbers[i]
    if (!window.includes(value)) {
      break
    }

    slide()
  }

  return value
}

function findContigousSet (value) {
  for (let windowSize = 2; windowSize < windowStep; windowSize++) {
    for (let x = 0; x < windowStep; x++) {
      let sum = 0
      let i = x
      let size = i + windowSize
      for (; i < size; i++) {
        sum += numbers[i]
      }

      if (sum === value) {
        return numbers.slice(i, i + windowSize)
      }
    }
  }
}

async function main () {
  const value = findFirstNumber()
  console.log(`Following value: <${value}> with index: ${windowStep + 1} steps: ${windowStep}`)

  const values = await findContigousSet(value)
  console.log(`Sum: ${Math.min.apply(0, values) + Math.max.apply(0, values)}`)
}

main()
