import fs from 'fs/promises'

async function readData() {
  const lines = await (
    fs.readFile('./input.txt', 'utf-8')
      .then(
        contents => contents.split('\n').filter(line => line)
      )
  )

  const pattern = /^(?<x1>\d+),(?<y1>\d+)\s->\s(?<x2>\d+),(?<y2>\d+)$/
  const segments = []
  const bottom = {
    x: 0,
    y: 0
  }

  for (const line of lines) {
    const result = pattern.exec(line)
    const { x1, y1, x2, y2 } = result.groups

    const xMax = Math.max(x1, x2)
    const yMax = Math.max(y1, y2)
    const segment = {
      x1: Number(x1),
      y1: Number(y1),
      x2: Number(x2),
      y2: Number(y2)
    }

    if (bottom.x < xMax) {
      bottom.x = xMax
    }

    if (bottom.y < yMax)  {
      bottom.y = yMax
    }

    segments.push(segment)
  }

  return {
    segments,
    bottom
  }
}

class Map {
  constructor(right, bottom) {
    this.top    = 0
    this.left   = 0
    this.right  = right
    this.bottom = bottom
    this.width  = right  + 1
    this.height = bottom + 1
    this.size   = this.width * this.height
    this.values = [...Array(this.size)].map(_ => 0)
  }

  static fromBottomPoint(point) {
    return new Map(
      point.x, point.y
    )
  }
}

function findAndMarkHorizontalAndVerticalLines(map, segments) {
  for (const segment of segments) {
    const isHorz = segment.y1 === segment.y2
    const isVert = segment.x1 === segment.x2

    // drop non horizontal and non vertical lines
    if (!isHorz && !isVert) {
      continue
    }


    const [min, max] = isHorz
      ? [Math.min(segment.x1, segment.x2), Math.max(segment.x1, segment.x2)]
      : [Math.min(segment.y1, segment.y2), Math.max(segment.y1, segment.y2)];

    let value = min
    const values = [...Array((max + 1) - min)].map(_ => value++)

    const points = isHorz
      ? values.map(x => ({x, y: segment.y1}))
      : values.map(y => ({x: segment.x1, y}))

    for (const point of points) {
      map.values[
        point.x + (point.y * map.width)
      ]++
    }
  }

  // for (let i = 0; i < map.size; i = i + map.width) {
  //   console.log(
  //     map.values
  //       .slice(i, i + map.width)
  //       .map(x => x === 0 ? '.' : String(x))
  //       .join('')
  //   )
  // }

  // console.log(
  //   map.filter(v => v >= 2).length
  // )
}

function findAndMarkDiagonalLines(map, segments) {
  for (const segment of segments) {
    // drop horizontal and vertical lines
    if (
      Math.abs(segment.x1 - segment.x2) !==
      Math.abs(segment.y1 - segment.y2)
    ) {
      continue
    }

    const incX = segment.x1 - segment.x2 > 0
      ? -1
      : 1

    const incY = segment.y1 - segment.y2 > 0
      ? -1
      : 1

    const points = []
    let x = segment.x1
    let y = segment.y1
    for (let i = 0, n = Math.abs(segment.x1 - segment.x2) + 1; i < n; i++) {
      points.push({
        x: x,
        y: y,
      })

      x += incX
      y += incY
    }

    for (const point of points) {
      map.values[
        point.x + (point.y * map.width)
      ]++
    }
    // console.log({
    //   segment,
    //   points
    // })
    // console.log()
  }

  // for (let i = 0; i < map.size; i = i + map.width) {
  //   console.log(
  //     map.values
  //       .slice(i, i + map.width)
  //       .map(x => x === 0 ? '.' : String(x))
  //       .join('')
  //   )
  // }
}

async function main() {
  const { segments, bottom } = await readData()
  const map = Map.fromBottomPoint(bottom)
  findAndMarkHorizontalAndVerticalLines(
    map, segments
  )
  console.log(
    map.values.filter(v => v >= 2).length
  )

  findAndMarkDiagonalLines(map, segments)
  console.log(
    map.values.filter(v => v >= 2).length
  )
  // solveQuiz1(segments, bottom)
}

main()
