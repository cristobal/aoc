
// .#!/usr/bin/env node
import fs from 'fs/promises'

function readData() {
  return fs.readFile('./input.txt', 'utf-8')
    .then(contents =>
      contents.split('\n')
        .filter(line => line)
        .map(line => Number(line))
    )
}

function solveQuiz1(depths) {
  let count = 0
  let value = depths[0]
  for (let i = 1, size = depths.length; i < size; i++) {
    if (value < depths[i]) {
      count++
    }
    value = depths[i]
  }

  return count
}

function solveQuiz2(depths) {
  let count = 0
  let value = depths[0] + depths[1] + depths[2]
  for (let i = 1, size = depths.length - (depths.length % 3); i < size; i = i + 1) {
    let value2 = depths[i] + depths[i + 1] + depths[i + 2]
    if (value < value2) {
      count++
    }
    value = value2
  }

  return count
}

async function main() {
  const depths = await readData()
  //console.log(depths.length, depths.length % 3)
  // console.log(
  //   solveQuiz1(depths)
  // )
  console.log(solveQuiz2(depths))
}

main()
