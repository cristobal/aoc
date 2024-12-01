import { readFileSync } from 'node:fs';

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

const leftSorted = left.toSorted((a, b) => a - b);
const rightSorted = right.toSorted((a, b) => a - b);

const distances =  /** @type {number[]} */([]);
for (let i = 0, size = leftSorted.length; i < size; i++) {
  distances.push(Math.abs(leftSorted[i] - rightSorted[i]));
}

console.log(distances.reduce((a, b) => a + b));

let sum = 0;
for (const value of leftSorted) {
  const total = rightSorted.filter((candidate) => candidate === value).length;
  const score = value * total;
  sum += score;
}

console.log(sum);
