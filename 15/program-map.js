#!/usr/bin/env NODE_ENV=production node --cpu-prof
function findRambunctiousNumber(numbers, turns) {
  const start = process.hrtime.bigint()

  // initialize history
  const history = new Map()
  numbers.forEach(
    (value, index) => history.set(value, index + 1)
  )

  // Algo
  let last = numbers[numbers.length - 1]
  for (let turn = (numbers.length + 1), stop = turns + 1; turn < stop; turn++) {
    let prev = history.get(last) ?? -1
    history.set(last, turn - 1)

    last = prev > -1
      ? turn - 1 - prev
      : 0
  }

  const stop = process.hrtime.bigint()
  const elapsed = Number.parseFloat(
    Number(stop - start) / 1e9
  ).toPrecision(2)

  return {
    value: last,
    seen: history.size,
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
