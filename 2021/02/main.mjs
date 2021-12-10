
// .#!/usr/bin/env node
import fs from 'fs/promises'

function readData() {
  return fs.readFile('./input.txt', 'utf-8')
    .then(contents =>
      contents.split('\n')
        .filter(line => line)
        .map(line => {
          const [position, value] = line.trim().split(' ')
          return {
            position,
            value: Number(value)
          }
        })
    )
}

function solveQuiz1(items) {
  let position = 0
  let depth = 0
  for (const item of items) {
    switch(item.position) {
      case 'forward':
        position += item.value
        break
      case 'down':
        depth += item.value
        break
      case 'up':
        depth -= item.value
        break
    }
  }
  return { position, depth, result: position * depth }
}

function solveQuiz2(items) {
  let aim = 0
  let position = 0
  let depth = 0
  for (const item of items) {
    switch (item.position) {
      case 'down':
        aim += item.value
        break
      case 'up':
        aim -= item.value
        break
      case 'forward':
        position += item.value
        depth += aim * item.value
        break
    }
  }
  return { position, depth, result: position * depth }
}

async function main() {
  const items = await readData()
  //console.log(solveQuiz1(items))
  console.log(solveQuiz2(items))
}

main()
