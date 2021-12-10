import fs from 'fs/promises'

async function readData() {
  const lines = await fs.readFile('./input.txt', 'utf-8')
    .then(
      contents => contents.split('\n')
        .filter(line => line)
    )

  const width = lines[0].length
  const height = lines.length
  const points = lines.map(
    line => line.split('').map(arg => Number(arg))
  ).flat()

  return { width, height, points }
}

function findLowestPointIndexes (data) {
  const { width, height, points } = data
  const results = []
  for (let i = 0, size = width * height; i < size; i++) {
    let point = points[i]
    let up    = i - width
    let down  = i + width
    let left  = i % width === 0
      ? -1
      : i - 1
    let right = (i + 1) % width === 0
      ? -1
      : i + 1

    // up exists and is lower than point
    if (up >= 0 && point >= points[up]) {
      continue
    }

    // down exists and is lower than point
    if (down < size && point >= points[down]) {
      continue
    }
    // left exists and is lower than point
    if (left >= 0 && point >= points[left]) {
      continue
    }

    // down exists and is lower than point
    if (right < size && point >= points[right]) {
      continue
    }

    results.push(i)
  }

  return results
}

function resolveBasinPointIndexes(data, index, seen = []) {
  const { width, height, points } = data
  const size = width * height
  const up   = index - width
  const down = index + width
  const left = index % width === 0
    ? -1
    : index - 1
  const right = (index + 1) % width === 0
    ? -1
    : index + 1

  seen.push(index)

  const results = [[index]]
  if (up >= 0 && points[up] < 9 && !seen.includes(up)) {
    results.push(
      resolveBasinPointIndexes(data, up, seen)
    )
  }

  if (down < size && points[down] < 9 && !seen.includes(down)) {
    results.push(
      resolveBasinPointIndexes(data, down, seen)
    )
  }

  if (left >= 0 && points[left] < 9 && !seen.includes(left)) {
    results.push(
      resolveBasinPointIndexes(data, left, seen)
    )
  }

  if (right < size && points[right] < 9 && !seen.includes(right)) {
    results.push(
      resolveBasinPointIndexes(data, right, seen)
    )
  }

  return results.flat().concat().sort((a, b) => a - b)
}

function solveQuiz1(data) {
  const points = findLowestPointIndexes(data)
  const value  = points.reduce(
    (sum, index) => sum + (data.points[index] + 1),
    0
  )
  console.log(value)
}

function solveQuiz2(data) {
  const points = findLowestPointIndexes(data)
  const basins = points.map(point => resolveBasinPointIndexes(data, point))
  const sizes  = basins.map(
    basin => basin.length
  ).sort((a, b) => b - a).slice(0, 3)
  console.log(sizes.reduce((a, b) => a * b))
}

async function main() {
  const data = await readData()
  solveQuiz1(data)
  solveQuiz2(data)
}

main()
