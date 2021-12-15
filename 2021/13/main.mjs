import fs from 'fs/promises'

function readData() {
  return fs.readFile('./input.txt', 'utf-8')
    .then(
      contents => contents.split('\n').filter(line => line)
    )
    .then(lines => {
      const coords = lines.map(
        line => {
          const result = /^(?<x>\d+),(?<y>\d+)$/.exec(line)
          return result
            ? { x: Number(result.groups.x), y: Number(result.groups.y) }
            : null
        }
      ).filter(coord => coord)

      const folds = lines.map(
        line => {
          const result = /^fold along (?<along>x|y)=(?<value>\d+)$/.exec(line)
          return result
            ? { along: result.groups.along, value: Number(result.groups.value) }
            : null
        }
      ).filter(fold => fold)

      return { coords, folds }
    })
}

function print_coords(coords) {
  const width  = coords.reduce((max, coord) => Math.max(max, coord.x), 0) + 1
  const height = coords.reduce((max, coord) => Math.max(max, coord.y), 0) + 1
  const size   = width * height

  const map = Array(size).fill('.')
  for (const coord of coords) {
    map[
      coord.x + (coord.y * width)
    ] = '#'
  }

  for (let i = 0; i < size; i += width) {
    console.log(map.slice(i, i + width).join(''))
  }
}

function fold_paper_up(coords, value) {
  return coords.map(
    (coord) => (
      coord.y >= value
        ? { x: coord.x, y: (value * 2) - coord.y }
        : coord
    )
  )
}

function fold_paper_left(coords, value) {
  return coords.map(
    (coord) => (
      coord.x >= value
        ? { x: (value * 2) - coord.x , y: coord.y }
        : coord
    )
  )
}

function fold_paper(coords, fold) {
  return fold.along === 'x'
    ? fold_paper_left(coords, fold.value)
    : fold_paper_up(coords, fold.value)
}

function solveQuiz1(coords, folds) {
  const visible = new Set(
    fold_paper(coords, folds[0]).map(({x, y}) => `${x},${y}`)
  )

  console.log(`Visible: ${visible.size}`)
}

function solveQuiz2(coords, folds) {
  const instructions = folds.reduce(
    (coords, fold) => fold_paper(coords, fold)
  , coords)

  console.log('Instructions:')
  print_coords(instructions)
}

async function main () {
  const { coords, folds } = await readData()
  solveQuiz1(coords, folds)
  solveQuiz2(coords, folds)
}

main()
