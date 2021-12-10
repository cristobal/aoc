#!/usr/bin/env NODE_ENV=production node
function findRambunctiousNumber(numbers, turns) {
  const start = process.hrtime.bigint()

  // 1. Initialize history with size of numbers
  const history = [];
  for (let i = 0; i < turns; i++) {
    history.push(0) }

  // 2. Add numbers with correct turn to history
  for (let i = numbers.length - 1; i--;) {
    history[numbers[i]] = i + 1
  }

  // 3. Algo
  let last = numbers[numbers.length - 1]
  for (let turn = (numbers.length + 1), stop = turns + 1; turn < stop; turn++) {
    let prev = history[last]
    history[last] = turn - 1

    last = prev === 0
      ? 0
      : turn - 1 - prev
  }

  const stop = process.hrtime.bigint()
  const elapsed = Number.parseFloat(
    Number(stop - start) / 1e9
  ).toPrecision(2)

  return {
    value: last,
    seen: history.filter(v => v > 0).length,
    elapsed
  }
}

// const input = [0, 3, 6]
const input = [12, 1, 16, 3, 11, 0]
const sizes = [
  2020,
  30000000
]

for (const size of sizes) {
  const result = findRambunctiousNumber(input, size)
  console.log(`The ${size}th number spoken is: ${result.value} (seen: ${result.seen}) (elapsed: ${result.elapsed}s)`)
}
