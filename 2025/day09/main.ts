import fs from 'node:fs';

type Pos = {
  y: number;
  x: number;
}

type Edge = {
  from: Pos;
  to: Pos;
  type: 'vertical' | 'horizontal';
}

type Corners = [Pos, Pos, Pos, Pos];

type Rectangle = {
  from: Pos;
  to: Pos;
  corners: Corners;
  width: number;
  height: number;
  area: number;
};

function parse_positions(filename: string): Pos[] {
  return fs.readFileSync(filename, 'utf-8')
    .split('\n')
    .filter((line) => line)
    .map((line) => {
      const [x, y] = line.split(',').map(Number);
      return {
        y,
        x
      };
    })
}

function calculate_rectangle(from: Pos, to: Pos): Rectangle {
  let [width, height] = [
    Math.abs(from.x - to.x) + 1,
    Math.abs(from.y - to.y) + 1,
  ];

  const corners = [
    // top left
    {
      y: Math.min(from.y, to.y),
      x: Math.min(from.x, to.x),
    },
    // top right
    {
      y: Math.min(from.y, to.y),
      x: Math.max(from.x, to.x),
    },
    // bottom left
    {
      y: Math.max(from.y, to.y),
      x: Math.min(from.x, to.x),
    },
    // bottom left
    {
      y: Math.max(from.y, to.y),
      x: Math.max(from.x, to.x),
    },
  ] as Corners;

  return {
    from,
    to,
    corners,
    width,
    height,
    area: width * height
  }
}

function calculate_line(from: Pos, to: Pos): Edge {
  if (from.y === to.y) {
    return {
      from: from.x < to.x ? from : to,
      to: from.x < to.x ? to : from,
      type: 'horizontal'
    }
  }

  return {
    from: from.y < to.y ? from : to,
    to: from.y < to.y ? to : from,
    type: 'vertical'
  }
}

function find_rectangles(positions: Pos[]): Rectangle[] {
  let rectangles = [] as Rectangle[];
  let size = positions.length;
  for (let a = 0; a < size; a++) {
    let from = positions[a];
    for (let b = a + 1; b < size; b++) {
      let to = positions[b];
      let rectangle = calculate_rectangle(from, to);
      rectangles.push(rectangle);
    }
  }

  return rectangles;
}

function find_edges(positions: Pos[]): Edge[]  {
  let edges = [] as Edge[];
  for (let index = 0; index < positions.length; index++) {
    let from = positions[index];
    let to   = positions[
      index === positions.length - 1
        ? 0
        : index + 1
    ];
    edges.push({
      from,
      to,
      type: from.y === to.y 
        ? 'horizontal'
        : 'vertical'
    })
  }

  return edges;
}

function find_vertical_boxes(edges: Edge[]) {

}

function solve_solution_one(positions: Pos[]): number {
  let rectangles = find_rectangles(positions);
  let sorted = rectangles.toSorted((a, b) => b.area - a.area);
  return sorted[0].area;
}


function solve_solution_two(positions: Pos[]) {
  // let edges = find_edges(positions);
  // let vertical = edges.filter((edge) => edge.type === 'vertical');
  // let horizontal = edges.filter((edge) => edge.type === 'horizontal');
  // let  boxes = find_vertical_boxes();
  let rectangles = find_rectangles(positions);
  for (let rectangle of rectangles) {
    let inside = rectangle.corners.every((corner) => IsPointInPolygon(corner, positions))
    if (inside) {
      console.log(rectangle.from, rectangle.to, rectangle.area)
      console.log()
    }
  }
}


const positions = parse_positions('./test.txt')
// console.log(`Solution 1: ${solve_solution_one(positions)}`);
solve_solution_two(positions);

// let board = Array.from({
//   length: 100,
// }).map(
//   _ => Array.from({
//     length: 100,
//   }).map(_ => '.')
// )

// for (let pos of positions) {
//   board[pos.y / 1000 | 0][pos.x / 1000 | 0] = '#';
// }

// for (let line of board) {
//   console.log(line.join(''))
// }