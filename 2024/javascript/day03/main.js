import { readFileSync } from 'node:fs';

const input = readFileSync('./input.txt').toString();

// Solution One
const solutionOneSum =
  input.matchAll(/mul\((\d+),(\d+)\)/g)
    .map(([, first, second]) => Number(first) * Number(second))
    .reduce((a, b) => a + b);
console.log(`Solution 1: ${solutionOneSum}`);

// Solution Two
let instructionEnabled = true;
let solutionTwoSum = 0;
for (const [, instr, first, second] of input.matchAll(/(do|don\'t)\(\)|mul\((\d+),(\d+)\)/g)) {
  if (instr === 'don\'t') {
    instructionEnabled = false;
    continue;
  }
  if (instr === 'do') {
    instructionEnabled = true;
    continue;
  }
  if (!instructionEnabled) {
    continue;
  }

  solutionTwoSum += Number(first) * Number(second);
}
console.log(`Solution 2: ${solutionTwoSum}`);
