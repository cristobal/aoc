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
    let bits = 35
    for (const arg of args) {
      const bit = BigInt(bits)
      const mask = arg === 'X' ? 'X' : BigInt(arg)
      masks.push({ bit, mask })
      bits--
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

const bitPermutations =
  (size, startSymbol = '') => {
    if (size === 0) {
      return [
        startSymbol + '1',
        startSymbol + '0'
      ]
    }

    return [
      bitPermutations(size - 1, startSymbol + '1'),
      bitPermutations(size - 1, startSymbol + '0')
    ].flat()
  }


const bitOn = BigInt(1)
const bitOff = BigInt(0)

const bitMasksPerms = new Map()
const parseFloatingBitMaskPerms =
  (floatingMasks) => {
    const size = floatingMasks.length - 1
    if (bitMasksPerms.has(size)) {
      return bitMasksPerms.get(size)
        .map(
          perm => (
            perm.map((mask, index) => ({ bit: floatingMasks[index].bit, mask }))
          )
        )
    }

    const bitPerms = bitPermutations(size)
      .map(
        bitPerm => bitPerm.split('').map(v => BigInt(v))
      )
    bitMasksPerms.set(size, bitPerms)

    return parseFloatingBitMaskPerms(floatingMasks)
  }

let enableBitMasks = null
let floatingMaskPerms = null
const memory = new Map()
for (const stmt of program) {
  if (isMask(stmt)) {
    const masks = parseMasks(stmt)
      .filter(mask => mask.mask !== bitOff)

    enableBitMasks = masks
      .filter(mask => mask.mask === bitOn)

    floatingMaskPerms = parseFloatingBitMaskPerms(
      masks.filter(mask => mask.mask === 'X')
    )
    continue
  }


  const mem = parseMem(stmt)
  let addr = BigInt(mem.addr)
  for (const mask of enableBitMasks) {
    addr |= bitOn << mask.bit // toggles bit on
  }

  for (const maskPerm of floatingMaskPerms) {
    dstAddr = addr
    for (const mask of maskPerm) {
      dstAddr &= ~(bitOn << mask.bit)
      dstAddr ^= (mask.mask << mask.bit)
    }
    debug(`memory.set(${dstAddr}, ${mem.val})`)
    memory.set(dstAddr, mem.val)
  }
}

const sum = Array.from(memory.values()).reduce((acc, val) => acc + val)
console.log({ sum })
