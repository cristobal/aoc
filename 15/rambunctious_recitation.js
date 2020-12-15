#!/usr/bin/env node
// const input = [0, 3, 6]
const input = [12,1,16,3,11,0]
const seen = new Map()
const size = 2020

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

console.log(input[input.length - 1])
