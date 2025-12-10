import fs from 'node:fs';

type Line = {
  diagram: string;
  buttons: number[][]
  jolts: number[];
}

type Machine = {
  diagram: number,
  buttons: number[],
}

function parse_lines(filename: string) {
  return fs.readFileSync(filename, 'utf-8')
    .split('\n')
    .filter(line => line)
    .map(
      (line) => {
        let args = line.trim().split(' ');

        let diagram = args[0]
          .replaceAll(/[\[\]]/g, '')
          .replaceAll('.', '0')
          .replaceAll('#', '1');
          
        let buttons = args.slice(1, -1)
          .map(
            (arg) => arg
              .replaceAll(/[()]/g, '')
              .split(',')
              .map(Number),
          );

        let jolts = args[args.length - 1]
          .replaceAll(/[{}]/g, '')
          .split(',')
          .map(Number);

        return {
          diagram,
          buttons,
          jolts,
        }
      }
    )
}

function parse_binary({ size, indices } : { size: number, indices: number[] }): number {
  let values = Array.from({ length: size }).map((_) => 0);
  for (let index of indices) {
    values[index] = 1;
  }

  return parseInt(values.join(''), 2);
}

function parse_machines(lines: Line[]): Machine[] {
  let machines = [] as Machine[];
  for (let line of lines) {
    let size    = line.diagram.length;
    let diagram = parseInt(line.diagram, 2);
    let buttons = line.buttons.map(
      (indices) => parse_binary({ size, indices }),
    );

    machines.push({
      diagram,
      buttons
    });
  }

  return machines;
}

// Cycles algorithm 
function* permutations<T>(iterable: T[], size: number): Generator<T[]> {
  let pool = [...iterable];
  let n = pool.length;

  let indices = Array.from({ length: n }, (_, i) => i);
  let cycles = Array.from({ length: size }, (_, i) => n - i);

  yield indices.slice(0, size).map(i => pool[i]);

  while (n) {
    let found = false;
    for (let i = size - 1; i >= 0; i--) {
      cycles[i]--;
      if (cycles[i] === 0) {
        // Rotate indices[i:] left by 1
        let temp = indices[i];
        for (let j = i; j < n - 1; j++) {
          indices[j] = indices[j + 1];
        }
        indices[n - 1] = temp;
        cycles[i] = n - i;
      } else {
        const j = cycles[i];
        [indices[i], indices[n - j]] = [indices[n - j], indices[i]];
        yield indices.slice(0, size).map(i => pool[i]);
        found = true;
        break;
      }
    }

    if (!found) {
      return;
    }
  }
}

function find_fewest({ diagram, buttons }: Machine): number {
  let index = buttons.findIndex(
    (button) => button === diagram
  );
  
  if (index !== -1) {
    return 1;
  }

  let indices = buttons.map((_, index) => index);
  let max_size = indices.length > 9 ? 9 : indices.length;
  for (let i = 2; i < max_size; i++) {
    for (let permutation of permutations(indices, i)) {
      let value = 0;
      let count = 0;
      let found = false;
      for (let index of permutation) {
        value ^= buttons[index];
        count += 1;
        if (value === diagram) {
          found = true;
          break;
        }
      }

      if (found) {
        return count;
      }
    }
  }


  throw new Error(`Could not find solution too large search space: ${buttons.length}`);
}

function solve_solution_one(lines: Line[], machines: Machine[]): number {
  let solution = 0;
  let index = 0;
  for (let machine of machines) {
    try {
      let value = find_fewest(machine);
      solution += value;
    } catch (error) {
      console.log('failed to find value for: ', lines[index])
    }
    index++;
  }

  return solution;
}

const lines = parse_lines('./input.txt');
const machines = parse_machines(lines);

console.log(`Solution 1: ${solve_solution_one(lines, machines)}`);