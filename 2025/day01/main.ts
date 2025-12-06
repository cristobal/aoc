import fs from 'node:fs';

type Direction = 'L' | 'R';
type Rotation  = {
  direction: Direction,
  distance: number;
};

function mod(dividend: number, divisor: number): number {
  return ((dividend % divisor) + divisor) % divisor;
}

function parse_sequence(): Rotation[] {
  return fs.readFileSync('./input.txt', 'utf-8')
    .matchAll(
      // pattern to match
      /^(L|R)(\d+)$/gm
    )
    .toArray()
    .map(
      ([_, direction, value]) => ({
        direction,
        distance: Number(value)
      } as Rotation)
    );
}

function solve_solution_one(sequence: Rotation[]): number {
  let dial = 50;
  let password = 0;
  for (const { direction, distance } of sequence) {
    dial = direction === 'L'
      ? dial - distance
      : dial + distance;

    // wrap-around using modulo operation
    dial = mod(dial, 100);

    // increment password when zero
    password += dial === 0
      ? 1
      : 0;    
  }

  return password;
}

function solve_solution_two(sequence: Rotation[]): number {
  let dial = 50;
  let password = 0;
  for (let { direction, distance } of sequence) {    
    let acc = direction === 'L' ? -1 : 1;    
    for (let i = 0; i < distance; i++) {
      dial += acc;

      // increment if dial is zero or 100 (remainder will be zero)
      password += dial % 100 === 0
        ? 1
        : 0;

      // wrap-around using modulo operation
      dial = mod(dial, 100);
    }
  }

  return password;
}

let sequence = parse_sequence();
console.log(`Solution 1: ${solve_solution_one(sequence)}`);
console.log(`Solution 1: ${solve_solution_two(sequence)}`);