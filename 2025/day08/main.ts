import { assert } from 'node:console';
import fs from 'node:fs';

type Pos = {
  x: number;
  y: number;
  z: number;
}

type Pair = {
  from: Pos;
  to: Pos;
  distance: number;
}

class Circuits {
  sets: Set<string>[];
  
  constructor(boxes: Pos[]) {
    this.sets = boxes.map(
      box => new Set([format_box(box)])
    );
  }

  find(box: string): Set<string> {
    let set = this.sets.find((candidate) => candidate.has(box));
    if (set === undefined) {
      throw new Error(`Did not find set for box: ${box}`);
    }

    return set;
  }

  merge(a: Set<string>, b: Set<string>) {
    if (this.sets.indexOf(a) === -1) {
      throw new Error(`Set ${a} not in Circuit`)
    }

    if (this.sets.indexOf(b) === -1) {
      throw new Error(`Set ${b} not in Circuit`)
    }

    this.sets.splice(
      this.sets.indexOf(a),
      1,
    )
    this.sets.splice(
      this.sets.indexOf(b),
      1
    )

    this.sets.unshift(a.union(b));
  }

  get size(): number {
    return this.sets.length;
  }

}

function parse_junction_boxes(filename: string): Pos[] {
  return fs.readFileSync(filename, 'utf-8')
    .split('\n')
    .filter(line => line)
    .map(
      line => {
        const [x, y, z] = line.split(',').map(Number);
        return {
          x,
          y, 
          z
        }
      }
    );
}

function format_box(box: Pos) {
  return `(${box.x},${box.y},${box.z})`;
}

function parse_distance(a: Pos, b:Pos): number {
  return Math.sqrt(
    (a.x - b.x)**2 + (a.y - b.y)**2 + (a.z - b.z)**2
  )
}

function find_pairs(boxes: Pos[]): Pair[] {
  let size = boxes.length;
  let pairs = [] as Pair[];
  
  for (let a = 0; a < size; a++) {
    for (let b = a + 1; b < size; b++) {
      let [from, to] = [boxes[a], boxes[b]];
      let distance = parse_distance(from, to);
      pairs.push({
        from,
        to,
        distance
      });
    }
  }

  return pairs;
}

function solve_solution_one(boxes: Pos[], total: number): number {
  let pairs = find_pairs(boxes);
  let ciruit = new Circuits(boxes);

  const sorted: Pair[] = pairs
    .toSorted((a, b) => a.distance - b.distance)
    .slice(0, total);

  for (const pair of sorted) {
    let from = ciruit.find(format_box(pair.from));
    let to = ciruit.find(format_box(pair.to));
    if (from === to) {
      continue;
    }

    ciruit.merge(from, to);
  }

  return ciruit
    .sets
    .toSorted((a, b) => b.size - a.size)
    .slice(0, 3)
    .map((set) => set.size)
    .reduce((acc, value) => acc * value, 1);
}

function solve_solution_two(boxes: Pos[]): number {
  let pairs = find_pairs(boxes);
  let ciruit = new Circuits(boxes);
  let solution = 0;
  const sorted: Pair[] = pairs
    .toSorted((a, b) => a.distance - b.distance)

  for (const pair of sorted) {
    let from = ciruit.find(format_box(pair.from));
    let to = ciruit.find(format_box(pair.to));
    if (from === to) {
      continue;
    }

    ciruit.merge(from, to);
    if (ciruit.size === 1) {
      solution = pair.from.x * pair.to.x;
      break;
    }
  }

  return solution;
}

const boxes = parse_junction_boxes('./input.txt');
console.log(`Solution 1: `, solve_solution_one(boxes, 1000));
console.log(`Solution 2: `, solve_solution_two(boxes));