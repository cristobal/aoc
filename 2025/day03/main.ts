import fs from 'node:fs';

function parse_batteries(): number[][] {
  return fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .filter(line => line)
    .map(
      (line) => line.split('').map(Number)
    );
}

function find_joltage(bank: number[], size: number): number {
  const joltage = Array.from({
    length: size
  }).map((_) => 9);

  let start = 0;
  for (let column = 0; column < size; column++) {
    let stop  = bank.length - (size - (column + 1));
    let slice = bank.slice(start, stop);
    for (let jolts = 9; jolts > 0; jolts--) {
      let joltsIndex = slice.findIndex((candidate) => candidate === jolts);
      if (joltsIndex >= 0) {
        start += joltsIndex + 1;
        joltage[column] = jolts;
        break;
      }
    }
  }

  return joltage
    .map(
      (jolts, index) => jolts * 10**(size - (1 + index)),
    )
    .reduce(
      (acc, value) => acc + value, 0
    );
}

function solver(batteries: number[][], size: number) {
  return batteries
    .map(
      (bank) => find_joltage(bank, size)
    )
    .reduce((acc, value) => acc + value, 0);
}

const batteries = parse_batteries();
console.log(`Solution 1: ${solver(batteries, 2)}`);
console.log(`Solution 2: ${solver(batteries, 12)}`);