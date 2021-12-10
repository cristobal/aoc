#!/usr/bin/env node
const program = require('fs').readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .filter(line => line)

let debugOn = false
const debug =
  (...args) => ((debugOn ? console.log(...args) : void 0))

const patterns = {
  mask: /^mask = (?<mask>(0|1|X){36,36})/,
  mem: /^mem\[(?<addr>\d+)\] = (?<val>(\d+))/
}

const isMask =
  stmt => patterns.mask.test(stmt)

const parseMasks =
  stmt => {
    const args = patterns.mask.exec(stmt).groups.mask
      .split('')

    const masks = []
    let bit = 35
    for (const arg of args) {
      if (arg !== 'X') {
        masks.push({
          bit: BigInt(bit),
          mask: BigInt(arg)
        })
      }
      bit--
    }

    return masks
  }

const parseMem =
  stmt => {
    const result = patterns.mem.exec(stmt)
    return {
      addr: BigInt(result.groups.addr),
      val: BigInt(result.groups.val),
    }
  }

const bitOn = BigInt(1)
const memory = new Map()
for (const stmt of program) {
  if (isMask(stmt)) {
    masks = parseMasks(stmt)
    continue
  }


  const mem = parseMem(stmt)
  for (const mask of masks) {
    debug(`bit: ${mask.bit}, mask: ${mask.mask}`)
    // clears bit setting it to 0
    // toggles bit on if mask 1 otherwise it will remain 0
    mem.val &= ~(bitOn << mask.bit)
    debug('bit cleared', `mem [${mem.addr}] = ${mem.val}`)
    mem.val ^= (mask.mask << mask.bit)
    debug('mask applied', `mem [${mem.addr}] = ${mem.val}`)

    debug(`memory.set(${mem.addr}, ${mem.val})`)
    memory.set(mem.addr, mem.val)
    debug()
  }
}

const sum = Array.from(memory.values()).reduce((acc, val) => acc + val)
console.log({ sum })
