
// .#!/usr/bin/env node
import fs from 'fs/promises'

function readData() {
  return fs.readFile('./input.txt', 'utf-8')
    .then(contents =>
      contents.split('\n')
        .filter(line => line)
        .map(line => line)
    )
}

function solveQuiz1(values) {
  const mcv_bits = values
    .reduce(
      // reducer
      (carry, value) => (
        carry.map((v, i) => (
          v + (value[i] == 0 ? -1 : 1)
        ))
      ),
      // initialValue
      [...Array(values[0].length)].map(_ => 0)
    )
    .map(v => v > 0 ? '1' : '0')

  const lcv_bits = mcv_bits.map(v => v === '1' ? '0' : '1')

  const gamma = parseInt(mcv_bits.join(''), 2)
  const epsilon = parseInt(lcv_bits.join(''), 2)

  return {
    gamma,
    epsilon,
    result: gamma * epsilon
  }
}

function solveQuiz2Pick(values, prefer) {
  let list = values.concat()
  let bit = 0
  while (list.length > 1) {
    let left_acc  = []
    let right_acc = []

    for (let i = 0; i < list.length; i++) {
      list[i][bit] === '1'
        ? left_acc.push(list[i])
        : right_acc.push(list[i])
    }
    bit++
    // left
    if (prefer === 1) {
      list = left_acc.length === right_acc.length
        ? left_acc
        : (
          left_acc.length > right_acc.length
          ? left_acc
          : right_acc
        )
    }
    // right
    else {
      list = left_acc.length === right_acc.length
        ? right_acc
        : (
          right_acc.length > left_acc.length
            ? left_acc
            : right_acc
        )
    }
  }

  return list[0]
}

function solveQuiz2(values) {
  const o2gr = parseInt(
    solveQuiz2Pick(values, 1),
    2
  )
  const co2sr = parseInt(
    solveQuiz2Pick(values, 0),
    2
  )
  return {
    o2gr,
    co2sr,
    result: o2gr * co2sr
  }
}

async function main() {
  const values = await readData()
  console.log(solveQuiz1(values))
  console.log(solveQuiz2(values))
}

main()
