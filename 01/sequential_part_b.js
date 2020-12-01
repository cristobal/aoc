const readline = require('readline')
const fs = require('fs')

function readValues() {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: fs.createReadStream('./input.txt'),
      output: process.stdout,
      terminal: false
    })

    const values = []
    rl.on('line', line =>
      values.push(Number.parseInt(line, 10))
    )
    rl.on('close',
      () => resolve(values)
    )
  })
}

function findNumbersWithSum(values, sum) {
  const size = values.length
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      // skip same indexes
      if (i === j) {
        continue
      }

      // skip a + b gt or eq to sum
      if ((values[i] + values[j]) >= sum) {
        continue
      }

      for (let k = 0; k < size; k++) {
        // skip same indexes
        if (i === k || j === k) {
          continue
        }

        if ((values[i] + values[j] + values[k]) === sum) {
          return [values[i], values[j], values[k]]
        }
      }
    }
  }

  return []
}


async function main() {
  const stats = []

  // read numbers
  let start = process.hrtime.bigint()
  const values = await readValues()
  let stop = process.hrtime.bigint()
  stats.push(start, stop)

  // find numbers with sum 2020
  start = stop
  const numbers = findNumbersWithSum(values, 2020)
  stop = process.hrtime.bigint()
  stats.push(start, stop)

  if (numbers.length === 0) {
    console.error('Could not find numbers...')
    process.exit(1)
  }

  console.log(
    `${numbers[0]} + ${numbers[1]} + ${numbers[2]} = ${numbers[0] + numbers[1] + numbers[2]}`
  )
  console.log(
    `${numbers[0]} * ${numbers[1]} * ${numbers[2]} = ${numbers[0] * numbers[1] * numbers[2]}`
  )

  const parseElapsedInMs =
    (start, stop) => Number(stop - start) / 1e6

  const toPrecision =
    (value, precision) => Number.parseFloat(value).toPrecision(precision)

  const read = parseElapsedInMs(stats[0], stats[1])
  const find = parseElapsedInMs(stats[2], stats[3])
  const total = read + find

  console.log(
    `stats (read: ${toPrecision(read, 2)}ms) (find: ${toPrecision(find, 2)}ms) (total: ${toPrecision(total, 2)}ms)`
  )
}

main()
