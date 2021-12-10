import fs from 'fs/promises'

function readData() {
  return fs.readFile('./input.txt', 'utf-8')
    .then(
      contents => contents.split('\n')
        .filter(line => line)
    )
}

async function main() {
  const data = await readData()
  const tags = {
    open: ['(', '[', '{', '<'],
    close: [')', ']', '}', '>']
  }
  const map = new Map([
    [')', '('],
    [']', '['],
    ['}', '{'],
    ['>', '<'],
    ['(', ')'],
    ['[', ']'],
    ['{', '}'],
    ['<', '>'],
  ])

  const corrupted = []
  const incomplete = []
  for (const input of data) {
    const stash = []
    const size = input.length
    let index = 0
    while (index < size) {
      const tag = input[index++]
      // close tag and no previous stash then stop
      if (tags.close.includes(tag) && stash.length === 0) {
        index--
        corrupted.push({ index, tag })
        break
      }

      // close tag and previous stashed tag do not match then stop
      if (tags.close.includes(tag) && (map.get(tag) !== stash[stash.length - 1])) {
        index--
        corrupted.push({index, tag})
        break
      }

      // close tag and previous stashed tag do match then pop and continue
      if (tags.close.includes(tag) && (map.get(tag) === stash[stash.length - 1])) {
        stash.pop()
        continue
      }

      // if open tag push it on the stash
      if (tags.open.includes(tag)) {
        stash.push(tag)
        continue
      }
    }

    // we reached end of input must be an incomplete input
    if (index === size) {
      incomplete.push(stash)
    }
  }

  // Quiz 1
  const corruptedPoints = new Map([
    [')', 3],
    [']', 57],
    ['}', 1197],
    ['>', 25137],
  ])
  const result = corrupted.reduce(
    (sum, item) => sum + corruptedPoints.get(item.tag),
    0
  )
  console.log(`Quiz1: ${result}`)

  // Quiz 2
  const incompletePoints = new Map([
    [')', 1],
    [']', 2],
    ['}', 3],
    ['>', 4],
  ])

  const complete = incomplete.map(
    (stash) => stash.concat().reverse().map(
      tag => incompletePoints.get(map.get(tag))
    )
  )

  const scores = complete.map(
    values => values.reduce((sum, value) => (sum * 5) + value, 0)
  ).sort((a, b) => b - a)

  // always odd list take middle
  const result2 = scores[(scores.length - 1) / 2]
  console.log(`Quiz2: ${result2}`)
}

main()
