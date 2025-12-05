import fs from 'node:fs';

type Pos = Readonly<{
  y: number;
  x: number;
}>;

const grid = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .filter(line => line)
  .map((line) => line.split('') as ('@' | '.')[]);

const [HEIGHT, WIDTH] = [grid.length, grid[0].length];

function find_positions(): Pos[] {
  const positions:Pos[] = []

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // skip empty spaces
      if (grid[y][x] === '.') {
        continue;
      }

      let sum = (
        // top
        (grid[y - 1]?.[x - 1]  === '@' ? 1 : 0) +
        (grid[y - 1]?.[x]      === '@' ? 1 : 0) +
        (grid[y - 1]?.[x + 1]  === '@' ? 1 : 0) +
        // middle
        (grid[y]?.[x - 1]  === '@' ? 1 : 0) +
        (grid[y]?.[x + 1]  === '@' ? 1 : 0) +    
        // bottom
        (grid[y + 1]?.[x - 1]  === '@' ? 1 : 0) +
        (grid[y + 1]?.[x]      === '@' ? 1 : 0) +
        (grid[y + 1]?.[x + 1]  === '@' ? 1 : 0)
      );

      if (sum < 4 ? 1 : 0) {
        positions.push({ y, x });
      }
    }
  }

  return positions;
}

// Solution 1
let positions = find_positions();
let total = positions.length;
console.log(`Solution 1: ${total}`);

// Solution 2
while (positions.length) {
  for (const pos of positions) {
    grid[pos.y][pos.x] = '.';
  }
  
  positions = find_positions();
  total += positions.length;
}
console.log(`Solution 2: ${total}`);