#!/usr/bin/env node
const numbers = require('fs').readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .filter(line => line)
  .map(line => Number.parseInt(line))

// append adapter with zero voltage at the start and sort the array
const adapters = [0].concat(numbers).sort((a, b) => a - b)
// append adapter with +3 voltage for the adapter with largest joltage at the end.
adapters.push(adapters[adapters.length - 1] + 3)

// Calculate jolt differences
const diffs = []
const size = adapters.length
for (let i = 1; i < size; i++) {
  diffs.push(adapters[i] - adapters[i -1])
}
console.log(diffs)

// Calculate the number of 1-jolt differences multiplied by the number
// of 3-jolt differences
const value =
  diffs.filter(v => v === 1).length *  diffs.filter(v => v === 3).length
console.log(`Number of 1-jolt differences multiplied by the numberof 3-jolt differences is: ${value}`)


// @see how to calculate with tribonnaci
// https://brilliant.org/wiki/tribonacci-sequence/
const sum = adapters.slice(1, adapters.length -1).reduce((a, b) => {
  a[b] = (a[b - 3] || 0) + (a[b - 2] || 0) + (a[b - 1] || 0);
  return a;
}, [1]).pop();
console.log(sum)

// TODO: walk the diffs
// const multipliers = []
// let n = 0
// for (let i = 0; i < diffs.length; i++) {
//   if (diffs[i] === 1) {
//     n++
//     continue
//   }

//   if (diffs[i] === 3 && n > 0) {
//     multipliers.push((n - 1) * 2)
//     n = 0
//   }
// }

// console.log(multipliers)
// const sum = multipliers.filter(value => value > 0).reduce((acc, value) => acc * value, 1)
// console.log({ sum })
// 7086739046912
