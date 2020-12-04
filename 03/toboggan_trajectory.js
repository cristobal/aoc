const fs = require('fs')
const readline = require('readline')

function readlines () {
  return new Promise(resolve => {
    const lines = []
    readline.createInterface({
      input: fs.createReadStream('./input.txt'),
      output: process.stdout,
      terminal: false
    })
    .on('line', line => lines.push(line))
    .on('close', () => resolve(lines))
  })
}

function traverseLinesAndCountTrees (lines, dx, dy) {
  let count = 0
  let width = lines[0].length
  let height = lines.length
  for (let y = 0, n = 0; y < height; y += dy, n++) {
    // console.log(`y: ${y}, n = ${n}, x: ${(dx * n) % width}, char: ${lines[y][(dx * n) % width]}`)
    if (lines[y][(dx * n) % width] === '#') {
      count++
    }
  }

  return count
}

async function main () {
  const lines = await readlines()
  const value = traverseLinesAndCountTrees(lines, 3, 1)
  console.log({ value })
  
  const values = [
    traverseLinesAndCountTrees(lines, 1, 1),
    traverseLinesAndCountTrees(lines, 3, 1),
    traverseLinesAndCountTrees(lines, 5, 1),
    traverseLinesAndCountTrees(lines, 7, 1),
    traverseLinesAndCountTrees(lines, 1, 2)
  ]
  const sum = values.reduce((acc, value) => acc * value, 1)
  console.log({values, sum})
}

main()
