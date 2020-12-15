#!/usr/bin/env node
function resolveRambunctiousNumber (input, size) {
  const seen = new Map()
  const start = process.hrtime.bigint()

  input.slice(0, -1)
    .forEach((value, index) => seen.set(value, index))

  for (let i = input.length; i < size; i++) {
    const pi = i - 1
    const prev = input[pi]
    const value = seen.has(prev)
      ? (pi + 1) - (seen.get(prev) + 1)
      : 0

    input.push(value)
    seen.set(prev, pi)
  }

  const stop = process.hrtime.bigint()
  const elapsed = Number.parseFloat(
    Number(stop - start) / 1e9
  ).toPrecision(2)

  return {
    value: input[input.length - 1],
    seen: seen.size,
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
  const result = resolveRambunctiousNumber(input, size)
  console.log(`The ${size}th number spoken is: ${result.value} (seen: ${result.seen}) (elapsed: ${result.elapsed}s)`)
}
