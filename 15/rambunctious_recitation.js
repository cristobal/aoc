#!/usr/bin/env node
function resolveRambunctiousNumber (input, size) {
  const lut = [...Array(size)].map(() => 0)
  const start = process.hrtime.bigint()

  input.slice(0, -1)
    .forEach((value, index) => { lut[value] = index })

  for (let i = input.length; i < size; i++) {
    const pi = i - 1
    const ppi = lut[input[pi]]
    const value = ppi > 0
      ? (pi + 1) - (ppi + 1)
      : 0

    input.push(value)
    lut[value] = i
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
