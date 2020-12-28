#!/usr/bin/env NODE_ENV=production node

function cupsFactory (labeling, max) {
  const values = labeling.split('').map(arg => Number(arg))

  const head = { next: null, value: values.shift() }
  let size = 1
  let tail = head
  for (const value of values) {
    tail.next = { next: null, value }
    tail = tail.next
    size = size + 1
  }

  if (tail.value < max) {
    for (let value = tail.value + 1; value <= max; value++) {
      tail.next = { next: null, value }
      tail = tail.next
      size = size + 1
    }
  }

  tail.next = head
  return { curr: head, size, tail }
}

function print (cups) {
  const head = cups.head
  const labels = []
  let next = head
  do {
    labels.push(next.value)
    next = next.next
  } while(next.value !== head.value)

  console.log(labels.join(' '))
}

function collect (cups, total) {
  let curr = cups.curr
  let next = curr
  do {
    if (next.value === 1) { break }
    next = next.next
  } while (next.value !== curr.value)

  const values = []
  for (let i = 0; i < total; i++) {
    next = next.next
    values.push(next.value)
  }

  return values
}

function move (cups) {
  let { curr } = cups

  // slice next three items clockwise to the head
  let start = curr.next
  let end   = curr.next.next.next

  // swap head.next to point to end.next of the slice
  curr.next = end.next
  end.next = null

  let value = curr.value - 1
  let next  = curr.next
  let low = {
    dist: Number.MAX_VALUE,
    dest: null
  }

  let high = {
    dist: 0,
    dest: null
  }

  do {
    let dist = value - next.value
    if (dist >= 0 && dist < low.dist) {
      low.dist = dist
      low.dest = next
    }
    if (dist < 0 && dist < high.dist) {
      high.dist = dist
      high.dest = next
    }

    if (dist === 0) { break }

    next = next.next
  } while (next.value !== curr.value) // full circle

  let dest = low.dest
    ? low.dest
    : high.dest

  // console.log(
  //   'curr', curr.value,
  //   'dest', dest.value,
  //   'value', value,
  //   'low', low.map(v => v.dist),
  //   'high', high.map(v => v.dist),
  //   'slice', [start.value, start.next.value, end.value].join(' ')
  //   )
  // print(cups)

  end.next = dest.next
  dest.next = start

  // print(cups)
  // console.log()

  cups.curr = curr.next
}

function play (cups, moves) {
  while (moves--) {
    move (cups)
  }
}

function partOne () {
  const cups = cupsFactory('135468729', 9)
  play(cups, 100)

  const values = collect(cups, cups.size - 1)
  return values.join('')
}

function partTwo () {
  const cups = cupsFactory('135468729', 1_000_000)
  play(cups, 10_000)

  const values = collect(cups, 2)
  return values.join(' ')
}

console.log(`Part one: ${partOne()}`)
console.log(`Part two: ${partTwo()}`)
