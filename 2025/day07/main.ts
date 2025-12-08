import { assert } from 'node:console';
import fs from 'node:fs';

type Char = 'S' | '|' | '^' | '.';
type Pos = { y: number; x: number; }

class Counter {
  values = new Map<string, number>();
  #key(pos: Pos) {
    return `(${pos.y},${pos.x})`;
  }

  get(pos: Pos) {
    return this.values.get(this.#key(pos)) ?? 0
  }

  set(pos: Pos, value: number) {
    this.values.set(
      this.#key(pos),
      value
    )
  }

  incBy(pos: Pos, value: number) {
    this.values.set(
      this.#key(pos),
      this.get(pos) + value
    )
  }
}

function parse_diagram(): Char[][] {
  return fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .filter(line => line)
  .map(line => line.split('')) as Char[][];
}

function solve_solution_one(puzzle: Char[][]): number {
  let solution = 0;

  const [height, width] = [puzzle.length, puzzle[0].length];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let pos = puzzle[y][x];
      if (pos === '.' || pos === '^') {
        continue;
      }
      
      // ensure that we have a next row otherwise at end
      if (y + 1 === height) {
        continue;
      }

      // get next pos (south)
      let next_pos = puzzle[y + 1][x];

      // if next pos is space or beam continue
      if (next_pos === '.' || next_pos === '|') {
        puzzle[y + 1][x] = '|';
        continue;
      }

      // next pos must be splitter
      assert(
        next_pos === '^', 
        `expected next position to be splitter, however encountered: <${next_pos}>`
      );

      solution += 1;

      // split beam left if possible
      if (puzzle[y + 1]?.[x - 1] !== undefined) {
        puzzle[y + 1][x  -1] = '|';
      }
      // split beam right if possible
      if (puzzle[y + 1]?.[x + 1] !== undefined) {
        puzzle[y + 1][x + 1] = '|';
      }
    }
  }
  
  // for (let line of puzzle) {
  //   console.log(line.join(''));
  // }

  return solution;
}

function solve_solution_two(puzzle: Char[][]): number {
  let counter = new Counter();

  const [height, width] = [puzzle.length, puzzle[0].length];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let pos = puzzle[y][x];
      if (pos === '.' || pos === '^') {
        continue;
      }
      
      // ensure that we have a next row otherwise at end
      if (y + 1 === height) {
        continue;
      }

      // get value at current pos
      let value = pos === 'S'
        ? 1
        : counter.get({ y, x });

      // get next pos (south)
      let next_pos = puzzle[y + 1][x];

      // if next pos is not splitter then must be space . or beam |
      if (next_pos !== '^') {
        next_pos === '.'
          ? counter.set({ y: y + 1, x}, value)
          : counter.incBy({ y: y + 1, x}, value)

        puzzle[y + 1][x] = '|';
        continue;
      }

      // next pos must be splitter
      assert(
        next_pos === '^', 
        `expected next position to be splitter, however encountered: <${next_pos}>`
      );

      // split beam left if possible
      if (puzzle[y + 1]?.[x - 1] !== undefined) {
        puzzle[y + 1][x - 1] === '.'
          ? counter.set({ y: y + 1, x: x - 1}, value)
          : counter.incBy({ y: y + 1, x: x - 1}, value);
        puzzle[y + 1][x - 1] = '|';
      }

      // split beam right if possible
      if (puzzle[y + 1]?.[x + 1] !== undefined) {
        puzzle[y + 1][x + 1] === '.'
          ? counter.set({ y: y + 1, x: x + 1}, value)
          : counter.incBy({ y: y + 1, x: x + 1}, value);
        puzzle[y + 1][x + 1] = '|';
      }
    }
  }

  let solution = 0;
  for (let y = height - 1, x = 0; x < width; x++) {
    solution += counter.get({ y, x });
  }

  return solution;
}

console.log(`Solution 1: ${solve_solution_one(parse_diagram())}`);
console.log(`Solution 2: ${solve_solution_two(parse_diagram())}`);
