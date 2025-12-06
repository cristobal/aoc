import fs from 'node:fs';

type Operator = '*' | '+';
type Problem = {
  operator: Operator,
  matrix: string[][]
};

function parse_problems() {
  let problems: Problem[] = [];
  let lines = fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .filter(line => line);

  let matches = lines
    .pop()!
    .matchAll(/([*+])(\s+)/g)
    .toArray()
    .map(
      ([_, operator, spaces]) => ({ operator, width: spaces.length }) as { operator: Operator, width: number }
    );

  // fix last column width at end (since no next column and therefore no extra additional space)
  matches[matches.length - 1].width += 1;

  let index = 0;
  for (let { operator, width } of matches) {
    let height = lines.length;
    let matrix = [] as string[][];
    for (let row = 0; row < height; row++) {
      matrix.push(
        lines[row].slice(index, index + width).split('')
      )
    }

    problems.push({
      operator,
      matrix,
    });
    index += (width + 1);
  }

  return problems;
}

function solve_solution_one(problems: Problem[]) {
  let solutions: number[] = []
  for (const { operator, matrix } of problems) {
    let solution = operator === '*'
      ? 1
      : 0;
    for (const args of matrix) {
      let value = Number(args.join(''));
      solution = operator === '*'
        ? solution * value
        : solution + value;
    }

    solutions.push(solution);
  }

  return solutions.reduce((acc, value) => acc + value, 0);
}

function solve_solution_two(problems: Problem[]) {
  function transpose_matrix(matrix: string[][]): string[][] {
    let [width, height] = [matrix[0].length, matrix.length];
    let transposed = 
      Array.from({ length: width }, 
        () => Array.from({ length: height }, () => '')
      );

    for (let x = width; x--;) {
      for (let y = 0; y < height; y++) {
        transposed[width - (x + 1)][y] = matrix[y][x];
      }
    }

    return transposed;
  }

  return solve_solution_one(
    problems.map(
      ({ operator, matrix }) => (
        {
          operator,
          matrix: transpose_matrix(matrix)
        }
      )
    )
  )
}

const problems = parse_problems();
console.log(`Solution 1: ${solve_solution_one(problems)}`);
console.log(`Solution 2: ${solve_solution_two(problems)}`);