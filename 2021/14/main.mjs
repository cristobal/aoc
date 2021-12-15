import fs from 'fs/promises'

async function readData() {
  const lines = await fs.readFile('./input.txt', 'utf-8')
    .then(
      contents => contents.split('\n').filter(line => line)
    )

  const sequence = lines.shift()
  const template = lines.reduce(
    (map, line) => {
      const result = /^(?<key>[A-Z]{2}) -> (?<value>[A-Z]{1})$/.exec(line)
      return map.set(
        result.groups.key,
        result.groups.value
      )
    },
    new Map()
  )

  // TODO: see how we can use regexp
  // const pattern = new RegExp(`^${Array.from(template.keys()).join('|')}$`)

  return { sequence, template }
}

class Node {
  next;
  #value;
  constructor(value) {
    this.#value = value
  }

  get value() {
    return this.#value
  }
}

class Polymer {
  #head = null;
  #tail = null;
  #size = 0;

  get size() {
    return this.#size
  }

  add(value) {
    if (this.#head === null) {
      this.#head = new Node(value)
      this.#tail = this.#head
      this.#size++
      return
    }

    this.#tail.next = new Node(value)
    this.#tail      = this.#tail.next
    this.#size++
  }

  * values() {
    let node = this.#head
    while (node) {
      yield node.value
      node = node.next
    }
  }

  static permutate(polymer, template) {
    const permutation = new Polymer()
    const values = polymer.values()
    let prev = values.next().value
    permutation.add(prev)

    for (const next of values) {
      let value = template.get(`${prev}${next}`)
      if (value) {
        permutation.add(template.get(`${prev}${next}`))
      }

      permutation.add(next)
      prev = next
    }

    return permutation
  }

  static computeQuantities(polymer, template) {
    const quantities = new Map()
    for (const value of polymer.values()) {
      quantities.set(
        value,
        (quantities.get(value) ?? 0) + 1,
      )
    }

    return quantities
  }

  static fromString(value) {
    const polymer = new Polymer()
    for (let i = 0; i < value.length; i++) {
      polymer.add(value[i])
    }

    return polymer
  }
}

function range(from, to) {
  return [...Array(to - from)].map((_, i) => from + i)
}

function find_min_max(quantities) {
  const keys = Array.from(quantities.keys())
  return {
    min: keys.reduce(
      (value, key) => Math.min(value, quantities.get(key)),
      Number.MAX_VALUE
    ),
    max: keys.reduce(
      (value, key) => Math.max(value, quantities.get(key)),
      0
    )
  }
}

function permutate(sequence, template, times) {
  return range(0, times).reduce(
    (polymer, _) => Polymer.permutate(polymer, template),
    Polymer.fromString(sequence)
  )
}

function solveQuiz1(sequence, template) {
  const polymer    = permutate(sequence, template, 10)
  const quantities = Polymer.computeQuantities(polymer)
  const result     = find_min_max(quantities)
  let sum = sequence.length
  for (let i = 0; i < 10; i++) {
    sum = (sum * 2) - 1
  }
  console.log(`Quiz1: ${result.max - result.min}, size: ${polymer.size}, sum: ${sum}`)
}

function solveQuiz2(sequence, template) {
  // Memory allocation failed even with v8 options --max-old-space-size=8192 --huge-max-old-generation-size
  // const polymer    = permutate(sequence.slice(0, 2), template, 40)
  // const quantities = Polymer.computeQuantities(polymer)
  // const result     = find_min_max(quantities)
  // let sum = sequence.length
  // for (let i = 0; i < 40; i++) {
  //   sum = (sum * 2) - 1
  // }
  // console.log(`Quiz2: ${result.max - result.min},  size: ${polymer.size}, sum: ${sum}`)

  let polymer = new Map()
  for (let i = 1; i < sequence.length; i++) {
    const key = `${sequence[i - 1]}${sequence[i]}`
    polymer.set(key, (polymer.get(key) ?? 0) + 1)
  }

  for (const _ of range(0, 40)) {
    let permutation = new Map()
    for (const [key, count] of polymer.entries()) {
      let ins = template.get(key)
      for (const next_key of [key[0] + ins, ins + key[1]]) {
        permutation.set(next_key, (permutation.get(next_key) ?? 0) + count)
      }
    }
    polymer = permutation
  }


  const quantities = new Map()
  const chars = Array.from(
    Array.from(polymer.keys())
    .join('')
    .split('')
    .reduce((set, key) => set.add(key), new Set())
  )

  for (const c of chars) {
    let left_sum  = 0
    let right_sum = 0
    for (const [key, count] of polymer.entries()) {
      if (key[0] === c) {
        left_sum += count
      }
      if (key[1] === c) {
        right_sum += count
      }
    }

    const value = Math.max(left_sum, right_sum)
    quantities.set(c, value)
  }
  const min = Array.from(quantities.values()).reduce(
    (min, value) => Math.min(min, value), Number.MAX_VALUE
  )

  const max = Array.from(quantities.values()).reduce(
    (max, value) => Math.max(max, value), 0
  )

  console.log(`Quiz2: ${max - min}`)
}

async function main() {
  const { sequence, template } = await readData()
  solveQuiz1(sequence, template)
  solveQuiz2(sequence, template)
}

main()
