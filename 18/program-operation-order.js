#!/usr/bin/env NODE_ENV=production node
const program = require('fs').readFileSync('./input.txt', 'utf-8')
.split('\n')
.filter(line => line)
.map(line => line.split('').filter(arg => arg.trim()))

const patterns = {
  number: /\d+/,
  operator: /[+*]/
}

const parentheses = {
  open: '(',
  close: ')'
}

const operators = {
  sum: Symbol('+'),
  multiplication: Symbol('*')
}

function calculate (args, depth = 0) {
  let acc = 0
  let index = 0
  let size = args.length
  let operator = operators.sum
  while (index < size) {
    // case number
    if (patterns.number.test(args[index])) {
      acc = operator === operators.sum
        ? acc + parseInt(args[index])
        : acc * parseInt(args[index])
      index++
      continue
    }

    // case operator
    if (patterns.operator.test(args[index])) {
      operator = args[index] === '+'
        ? operators.sum
        : operators.multiplication
      index++
      continue
    }

    // must be case parentheses start (
    let pos = index + 1
    let count = 1
    while (count > 0) {
      if (args[pos] === parentheses.open) {
        count++; pos++
        continue
      }

      if (args[pos] === parentheses.close) {
        count--; pos++
        continue
      }

      pos++
    }

    let result = calculate(
      args.slice(index + 1, pos - 1), depth + 1
    )

    // console.log({ acc, operator , result })
    acc = operator === operators.sum
      ? acc + result
      : acc * result

    index = pos
  }

  return acc
}

const partOneResult =
  program.map(args => calculate(args)).reduce((a, b) => a + b)
console.log(`Part on result ${partOneResult}`)
