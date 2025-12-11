import fs from 'node:fs';

function parse_devices(filename: string): Record<string, string[]> {
  let devices = {} as Record<string, string[]>;
  let lines = fs.readFileSync(filename, 'utf-8')
    .split('\n')
    .filter((line) => line);
  
  for (let line of lines) {
    let args = Array.from(line.matchAll(/([a-z]+)/g))
      .map((match) => match[0]);
    let name = args.shift()!;
    let outputs = args.concat();

    devices[name] = outputs;
  }

  return devices;
}


type TraverseOptions = {
  device: string;
  target: string;
  devices: Record<string, string[]>;
};

function traverse_dfs(
  { device, target, devices }: TraverseOptions, 
  { path, solutions }: { path: string[]; solutions: string [][]; } = { path: [], solutions: [] }
): string[][] {
  // reached target
  if (device === target) {
    solutions.push(path.concat(target));
    return solutions;
  }

  // loop
  if (path.includes(device)) {
    return solutions;
  }

  for (let candidate of devices[device]) {

    traverse_dfs(
      {
        device: candidate, 
        target, 
        devices,
      },
      {
        path: path.concat([device]),
        solutions,
      }
    );
  }

  return solutions;
}


let memo: Record<string, number> = {};
function traverse_dfs_memoized(
  { device, target, devices }: TraverseOptions, 
): number {
  // reached target
  if (device === target) {
    return 1;
  }
  
  let key = `(${device},${target})`; 
  if (memo[key] !== undefined) {
    return memo[key];
  }

  let sum = 0;
  for (let candidate of devices[device] ?? []) {
    sum += traverse_dfs_memoized(
      {
        device: candidate, 
        target, 
        devices,
      },
    );
  }


  memo[key] = sum;
  return sum;
}

// function traverse_bfs({ device, target, devices }: TraverseOptions): string[][] {
//   let solutions = [] as string[][];
//   let Q = [[device]];

//   while (Q.length) {
//     let S = [] as string[][];
//     for (let path of Q) {
//       // reached target
//       if (path.includes(target)) {
//         solutions.push(path);
//         if (debug) {
//           console.log('found solution', solutions);
//         }
//         continue;
//       }

//       let start = path[path.length - 1];
//       for (let candidate of devices[start] ?? []) {
//         if (exclude?.includes(candidate)) {
//           continue;
//         }

//         // skip loop 
//         if (path.includes(candidate)) {
//           continue;
//         }

//         S.push(path.concat([candidate]))
//       }
//     }

//     Q = S;
//   }

//   return solutions;
// }

function solve_solution_one(devices: Record<string, string[]>): number {
  let solutions = traverse_dfs({
    device: 'you', 
    target: 'out', 
    devices,
  });

  return solutions.length;
}

function solve_solution_two(devices: Record<string, string[]>): number {
  let solution = 0;

  for (let path of [
    // svr -> fft -> dac -> out
    ['svr', 'fft', 'dac', 'out'],
    // svr -> dac -> fft -> out
    ['svr', 'dac', 'fft', 'out'],
  ]) {
    let sum = 1;
    for (let from = 0, to = 1, size = path.length - 1; from < size;) {
      let ans = traverse_dfs_memoized({
        device: path[from++],
        target: path[to++],
        devices,
      });
      sum *= ans;
    }
    solution += sum;
  }

  return solution;
}

let devices = parse_devices('./input.txt');
console.log(`Solution 1: ${solve_solution_one(devices)}`);
console.log(`Solution 2: ${solve_solution_two(devices)}`);