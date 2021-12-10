#!/usr/bin/env NODE_ENV=production node

function cupsFactory (input, size) {
  const items = Array(size + 1)
  items[0] = 0

  const args = input.split('').map(arg => Number(arg))
  const max = Math.max(...args)

  let head = args.shift()
  let tail = head
  for (const next of args) {
    items[tail] = next
    tail = next
  }

  for (let next = max + 1; next <= size; next++) {
    items[tail] = next
    tail = next
  }

  items[tail] = head

  return { low: 1, high: size, size, curr: head, items }
}

function collect (cups, from, total) {
  const values = []
  let tail = cups.items[from]
  for (let i = 0; i < total; i++) {
    values.push(tail)
    tail = cups.items[tail]
  }

  return values
}

function print (cups, from = 1) {
  const labels = [ from ].concat(
    collect(cups, from, cups.size - 2)
  )

  console.log(labels.join(' '))
}

function move (cups) {
  const { curr, items } = cups

  // slice next three items clockwise to current
  const slice = [
    items[curr],
    items[items[curr]],
    items[items[items[curr]]],
  ]

  // set current to point the value oointed by the end of the slice
  items[curr] = items[slice[2]]

  // dest
  let dest = curr - 1
  do {
    if (
      (slice[0] !== dest) &&
      (slice[1] !== dest) &&
      (slice[2] !== dest)
    ) { break }

    dest--
  } while (dest > 0)

  if (dest <= 0) {
    dest = cups.high
    do {
      if (
        (slice[0] !== dest) &&
        (slice[1] !== dest) &&
        (slice[2] !== dest)
      ) { break }

      dest--
    } while (dest > 0)
  }

  items[slice[2]] = items[dest]
  items[dest] = slice[0]

  // console.log(
  //   'curr', curr,
  //   'dest', dest,
  //   'slice', slice
  // )
  // print(cups, curr)
  // console.log()

  cups.curr = items[curr]
}

function play (cups, moves) {
  while (moves--) {
    move (cups)
  }
}

function partOne () {
  const cups = cupsFactory('135468729', 9)
  play(cups, 100)

  const values = collect(cups, 1, cups.size - 1)
  return values.join('')
}

function partTwo () {
  const cups = cupsFactory('135468729', 1_000_000)
  play(cups, 10_000_000)

  const values = collect(cups, 1, 2)
  return `${values[0]} * ${values[1]} = ${values[0] * values[1]}`
}

console.log(`Part one: ${partOne()}`)
console.log(`Part two: ${partTwo()}`)
