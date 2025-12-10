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

type Rectangle = {
  from: Pos;
  to: Pos;
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

  return {
    from,
    to,
    width,
    height,
    area: width * height
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

function solve_solution_one(positions: Pos[]): number {
  let rectangles = find_rectangles(positions);
  let sorted = rectangles.toSorted((a, b) => b.area - a.area);
  return sorted[0].area;
}

// https://en.wikipedia.org/wiki/Intersection_(geometry)#Two_lines
// https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
function is_edge_inside_rectangle(edge: Edge, rectangle: Rectangle): boolean {
  // Rectangle A (top left) - B - C - D (bottom right)
  let Ay = Math.min(rectangle.from.y, rectangle.to.y);
  let Ax = Math.min(rectangle.from.x, rectangle.to.x);

  let Dy = Math.max(rectangle.from.y, rectangle.to.y);
  let Dx = Math.max(rectangle.from.x, rectangle.to.x);

  // Check if vertical edge is inside rect
  // there must be an P(x,y_n) = (x1,y_n)
  if (edge.type === 'vertical') {
    let x      = edge.from.x;
    let min_y = Math.min(edge.from.y, edge.to.y);
    let max_y = Math.max(edge.from.y, edge.to.y);

    return Ax < x && x < Dx && min_y < Dy && max_y > Ay;
  }     
  
  // Check if horizontal edge is inside rect
  // there must be an P(x_n,y1) = (x_n,y1)
  let y = edge.from.y;
  let min_x = Math.min(edge.from.x, edge.to.x);
  let max_x = Math.max(edge.from.x, edge.to.x);

  return Ay < y && y < Dy && min_x < Dx && max_x > Ax;
}

function solve_solution_two(positions: Pos[]) {
  let edges      = find_edges(positions);
  let candidates = [] as Rectangle[];
  for (let rectangle of find_rectangles(positions)) {
    // If any edge of the polygon is inside the rectangle, then the rectangle is outside the polygon
    if (edges.some((edge) => is_edge_inside_rectangle(edge, rectangle))) {
      continue;   
    }

    candidates.push(rectangle);
  }

  let sorted = candidates.toSorted((a, b) => b.area - a.area);
  return sorted[0].area;
}


const positions = parse_positions('./input.txt')
console.log(`Solution 1: ${solve_solution_one(positions)}`);
console.log(`Solution 2: ${solve_solution_two(positions)}`);
