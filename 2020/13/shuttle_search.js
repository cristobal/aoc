#!/usr/bin/env node
const lines = require('fs').readFileSync('./sample.txt', 'utf-8')
  .split('\n')
  .filter(line => line)

const cts = Number.parseInt(lines[0])
const buses = lines[1].split(',').map((v, index) => {
  if (v === 'x') {
    return null
  }

  return {
    id: Number.parseInt(v),
    index
  }
}).filter(v => v)

const rems = buses.map(bus => cts % bus.id)
const nextDepartures = buses.map(
  (bus, index) => ({ bus, ts: (cts - rems[index]) + bus.id })
)
const earliestDeparture = nextDepartures.reduce(
  (prev, next) => prev.ts < next.ts ? prev : next,
)

const wait = earliestDeparture.ts - cts
console.log(earliestDeparture, earliestDeparture.bus.id * wait)

// part 2
let inc = buses[0].id
let pts = inc // buses.slice(0, -1).reduce((acc, bus) => acc * bus.id, 1)
for (let i = 1; i < buses.length; i++) {
  let steps = 0
  while (true) {
    if ((pts + buses[i].index) % buses[i].id === 0) {
      console.log(buses[i], { inc, pts, steps })
      inc *= buses[i].id
      break
    }
    steps++
    pts += inc
  }
}

console.log({ pts, steps })

/*
  Note: See how CRT works.
  Resources:
    * https://math.stackexchange.com/questions/2218763/how-to-find-lcm-of-two-numbers-when-one-starts-with-an-offset?newreg=e89d9ad751394d048f299a028b458d9b
    * https://brilliant.org/wiki/chinese-remainder-theorem/
*/
