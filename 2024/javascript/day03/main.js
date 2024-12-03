import { readFileSync } from 'node:fs';

// Read values from file
const input = readFileSync('./input.txt').toString();

let sum = 0;
const pattern = /mul\((\d+),(\d+)\)/g;
for (const match of input.matchAll(pattern)) {
  sum += Number(match[1]) * Number(match[2])
}
console.log(sum);

let sum2 = 0;
let enabled = true;
const pattern2 = /(do|don\'t)\(\)|mul\((\d+),(\d+)\)/g;
for (const match of input.matchAll(pattern2)) {
  if (match[1] === "don't") {
    enabled = false;
    continue;
  } 
  if (match[1] === "do") {
    enabled = true;
    continue;
  }
  if (!enabled) {
    continue;
  }
  // console.log(match[1], match[2])
  sum2 += Number(match[2]) * Number(match[3])
}
console.log(sum2);
