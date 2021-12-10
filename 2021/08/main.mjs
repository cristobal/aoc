import fs from 'fs/promises'

function readData() {
  return fs.readFile('./input.txt', 'utf-8')
    .then(
      contents => contents.split('\n')
        .filter(line => line)
        .map(
          line => line.split(' | ').map(arg => arg.split(' '))
        )
        .map(([signalWires, segments]) => ({ signalWires, segments }))
    )
}

function solveQuiz1(data) {
  const numbersMap = new Map([
    [2, 1], // 2 => 1
    [4, 4], // 4 => 4
    [3, 7], // 3 => 7
    [7, 8], // 7 => 8
  ])

  const sum = data.map(
    io => io.segments.filter(
      segment => numbersMap.has(segment.length)
    )
  ).flat().length

  console.log(sum)
}

function solveQuiz2(data) {
  const numbers = []
  for (const io of data) {
    const keys =
      io.signalWires.concat()
        .sort((a, b) => a.length - b.length)
        .map(arg => arg.split('').concat().sort().join(''))

    // we deduce 1, 7, 4 and eight by length
    const one   = keys[0]
    const seven = keys[1]
    const four  = keys[2]
    const eight = keys[9]

    const union =
      (chars_a, chars_b) => (
        chars_a.split('').filter(char => chars_b.indexOf(char) > -1)
      )

    const findCandidates =
      (words, chars, size) => (
        words.filter(
          chars_a => union(chars_a, chars).length === size
        )
      )

    /* Find 0, 6 and nine
      - Find single candidate for number 9 that will contain all four characters of the number 4
      - Find at most two candidates for 0 that will contain all three characters of the number 7,
        excluding nine
      - We can deduce the number 6 since its the only one left of the three signal wires that is neither 9 nor 0.
    */
    const args069 = keys.slice(6, 9)
    const [nine] = findCandidates(args069, four, 4)

    const [zero] = findCandidates(args069, seven, 3)
      .filter(arg => arg !== nine)

    const six = args069[
      3 - (args069.indexOf(zero) + args069.indexOf(nine))
    ]

    /* Find 2, 3 and 5
      - Find single candidate for 5 from the signale wire 6 since it will include five of the characters from 6
      - Find single candidate for 3 from the signale wire 5 since it will include 4 of the characters from 5
      -  We can deduce the number 2 since its the only one left of the three signal wires that is neither 5 nor 3.
    */
    const args235 = keys.slice(3, 6)
    const [five]  = findCandidates(args235, six, 5)
    const [three] = findCandidates(args235, five, 4)
    const two = args235[
      3 - (args235.indexOf(three) + args235.indexOf(five))
    ]

    const map = new Map([
      [zero,  '0'],
      [one,   '1'],
      [two,   '2'],
      [three, '3'],
      [four,  '4'],
      [five,  '5'],
      [six,   '6'],
      [seven, '7'],
      [eight, '8'],
      [nine,  '9'],
    ])

    const value =
      io.segments.map(
        segment => {
          const key = segment.split('').concat().sort().join('')
          return map.get(key) ?? -1
        }
      ).join('')


    numbers.push(
      Number(value)
    )
  }

  console.log(numbers.reduce((a, b) => a + b, 0))
}

async function main() {
  const data = await readData()
  solveQuiz1(data)
  solveQuiz2(data)
}

main()
