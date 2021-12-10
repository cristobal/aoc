import fs from 'fs/promises'

function readData() {
  return fs.readFile('./input.txt', 'utf-8')
    .then(
      contents => contents.trim().split(',').filter(value => value).map(value => Number(value))
    )
}

/* helpers */
const minOf =
  (numbers) => Math.min.apply(Math, numbers)

const maxOf =
  (numbers) => Math.max.apply(Math, numbers)

const sum =
  (a, b) => a + b

const abs =
  Math.abs

const range =
  (size, step = 0) => [...Array(size)].map((_, i) => i + step)

function solveQuiz1(numbers) {
  const min = minOf(numbers)
  const max = maxOf(numbers)

  // could be parallelized (is it worth it?)
  const costs = range((max + 1) - min).map(
    // compute the fuel cost from -> to for all the numbers
    to =>
      numbers.map(from => abs(from - to))
        .reduce(sum)
  )

  const value = minOf(costs)
  console.log(value)
}

function solveQuiz2(numbers) {
  // sorted range
  const min = minOf(numbers)
  const max = maxOf(numbers)

  // lut
  const costByDistance = new Map()

  // could be parallelized (is it worth it?)
  const costs = range((max + 1) - min).map(
    // compute the fuel cost from -> to for all the numbers
    to =>
      numbers.map(from => {
          // about a bit less than 2mill call to this function so the lut is worth it
          // real 19s without lut and 0.25s with lut
          const dist = abs(from - to)
          return costByDistance.get(dist) ?? (
            () => {
              const cost = range(dist, 1).reduce(sum, 0)
              costByDistance.set(dist, cost)
              return cost
            }
          )()
        })
      .reduce(sum)
  )

  const value = minOf(costs)
  console.log(value)
}

async function main() {
  const numbers = await readData()
  solveQuiz1(numbers)
  solveQuiz2(numbers)
}

main()
