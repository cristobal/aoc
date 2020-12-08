#!/usr/bin/env node
const stack = require('fs').readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .filter(line => line)
  .map(line => {
    const [instr, value] = line.split(' ')
    return { instr, value: Number.parseInt(value) }
  })

const stackSize = stack.length

function run () {
  // the instruction cycles
  const cycle = []

  // the instructions processed
  const processed = [...Array(stackSize)].map(() => false)

  // the stack
  let index = 0
  let sum = 0
  do {
    const frame = stack[index]
    cycle.push(index)
    processed[index] = true

    if (frame.instr === 'nop') {
      index = index + 1
      continue
    }

    if (frame.instr === 'acc') {
      sum = sum + frame.value
      index = index + 1
      continue
    }

    // jmp instruction
    index = index + frame.value
  } while (processed[index] === false)

  return { sum, cycle, index }
}

let result  = run ()
console.log(`acc: ${result.sum}`)

// brute force, this can be done better.
let index = 0
let instr = null
for (; index < stackSize; index++) {
  const frame = stack[index]
  if (frame.instr === 'acc') {
    continue
  }

  instr = frame.instr
  frame.instr = frame.instr === 'jmp'
    ? 'nop'
    : 'jmp'

  result = run()
  if (result.index === stackSize) {
    break
  }

  frame.instr = instr // revert
}

console.log(`acc: ${result.sum}, index: ${index}, was: ${instr}, now: ${stack[index].instr}`)