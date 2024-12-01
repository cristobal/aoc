import { readFileSync } from 'node:fs';

// Read values from file
const lines = readFileSync('./input.txt')
  .toString()
  .split('\n');
const left = /** @type {number[]} */ ([]);
const right = /** @type {number[]} */([]);
const pattern = /(\d+)\s+(\d+)/;
for(const line of lines) {
  const match = line.split(pattern)
  if (!match) {
    continue;
  }

  left.push(Number(match[1]));
  right.push(Number(match[2]));
}

// sort lists
const leftSorted = left.toSorted((a, b) => a - b);
const rightSorted = right.toSorted((a, b) => a - b);

// distance
const distance =
  leftSorted
    .map((_, index) => Math.abs(leftSorted[index] - rightSorted[index]))
    .reduce((a, b) => a + b)
console.log(`Solution 1: Distance between lists: ${distance}`);

// score
let score = 0;
for (const value of leftSorted) {
  const total = rightSorted.filter((candidate) => candidate === value).length;
  score += value * total;
}
console.log(`Solution 2: Similarity score between lists: ${score}`);
