#!/usr/bin/env node
function resolveRambunctiousNumber (input, size) {
  const seen = new Map()
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

  return input[input.length - 1]
}

// console.log(`The 2020th number spoken is: ${partOne([0, 3, 6], 2020)}`)
console.log(`The 2020th number spoken is: ${resolveRambunctiousNumber([12, 1, 16, 3, 11, 0], 2020)}`)
console.log(`The 30000000th number spoken is: ${resolveRambunctiousNumber([12, 1, 16, 3, 11, 0], 30000000)}`)
