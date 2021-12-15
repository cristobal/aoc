import fs from 'fs/promises'

function readData() {
  return fs.readFile('./input.txt', 'utf-8')
    .then(
      contents => contents.split('\n')
        .filter(line => line)
        .map(line => line.split('-'))
        .map(([from, to]) => ({from, to}))
    )
}

function readMap(edges) {
  return edges.reduce(
    (map, edge) => {
      if (edge.to === 'start') {
        return map.set('start', (map.get('start') ?? new Set()).add(edge.from))
      }

      if (edge.from === 'end') {
        return map.set(edge.to, (map.get(edge.to) ?? new Set()).add('end'))
      }

      map.set(
        edge.from,
        (map.get(edge.from) ?? new Set()).add(edge.to)
      ).set(
        edge.to,
        (map.get(edge.to) ?? new Set()).add(edge.from)
      )
      return map
    },
    new Map()
  )
}

function solveQuiz1(map) {
  const paths = []
  const walk = (from, path = []) => {
    if (from === 'end') {
      paths.push(path.concat('end'))
      return
    }

    for (const to of map.get(from)) {
      if (path.includes(to) && to.toLowerCase() === to) { continue }
      walk(to, path.concat(from))
    }
  }

  walk('start')
  console.log(paths.length)
}

function solveQuiz2(map) {
  const paths = []
  const lower = Array
    .from(map.keys())
    .filter(key => key.toLowerCase() === key)

  const walk = (from, path = []) => {
    if (from === 'end') {
      paths.push(path.concat('end'))
      return
    }

    if (path.length > 0 && from === 'start') {
      return
    }

    const counter = path.concat(from).reduce(
      (map, key) => map.set(key, (map.get(key) ?? 0 )+ 1), new Map()
    )

    const lower_max = lower.reduce(
      (max, key) => Math.max(max, counter.get(key) ?? 0), 0
    )

    for (const to of map.get(from)) {
      if (path.includes(to) && lower.includes(to) && lower_max === 2) {
        continue
      }

      walk(to, path.concat(from))
    }
  }

  walk('start')
  console.log(paths.length)
}

async function main() {
  const edges = await readData()
  const map = readMap(edges)
  solveQuiz1(map)
  solveQuiz2(map)
}

main()
