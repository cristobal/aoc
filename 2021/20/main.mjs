import fs from 'fs/promises'

class Image {
  constructor(values = [], width = 0, height = 0) {
    this.values = values
    this.width  = width
    this.height = height
  }

  static copy(image) {
    return new Image(
      Array.from(image.values),
      image.width,
      image.height,
    )
  }
}

async function readData(filename) {
  const contents = await fs.readFile(filename, 'utf-8')
  const lines    = contents.split('\n').filter(l => l)

  const algo  = lines[0].split('')
  const image = new Image(
    lines.slice(1).map(line => line.split('')).flat(),
    lines[1].length,
    lines.length - 1
  )

  return {
    algo,
    image
  }
}

function debugImage({ values, width, height }) {
  console.log({ width, height })
  for (let i = 0, size = width * height; i < size; i += width) {
    console.log(values.slice(i, i + width).join(''))
  }
}

function expand(input, fill) {
  // remap and center input into new output image that expands 1px in every direction
  const output = new Image(
    Array((input.width + 2) * (input.height + 2)).fill(fill),
    input.width  + 2,
    input.height + 2,
  )

  for (let index = 0, size = input.width * input.height; index < size; index++) {
    let offset = (output.width + 1) + (2 * (Math.floor(index  / input.width)))
    output.values[offset + index] = input.values[index]
  }

  return output
}

function enhance(input, algo, fill) {
  const output = Image.copy(input)

  const leftVal =
    val => (
      val % output.width === 0
        ? -1
        : val - 1
    )
  const rightVal =
    val => (
      (val + 1) % output.width === 0
        ? -1
        : val + 1
    )

  const valueAt =
    index => {
      // outside output image
      if (index < 0) {
        return fill
      }

      // outside output image
      if (index > ((output.width * output.height) -1)) {
        return fill
      }

      // get value from input image
      return input.values[index]
    }

  for (let i = 0, size = output.width * output.height; i < size; i++) {
    const coords = [
      leftVal(i - output.width), i - output.width, rightVal(i - output.width),
      leftVal(i), i, rightVal(i),
      leftVal(i + output.width), i + output.width, rightVal(i + output.width),
    ]
    const repr = coords.map(val => valueAt(val) === '#' ? '1' : '0').join('')
    output.values[i] = algo[parseInt(repr, 2)]
  }

  return output
}

function convolve(input, algo, times) {
  let output = input
  /*
    NOTE:
      Need to flip the fill depending on the step/round:
      - If the algo[0] === '.', we just use '.' as fill.
      - Otherwise we flip between the last and first fill from the algo.

  */
  let fills = algo[0] === '.' ? ['.', '.'] : [algo[511], algo[0]]
  for (let i = 0; i < times; i++) {
    let fill = fills[i & 1]
    output =
      enhance(
        expand(output, fill),
        algo,
        fill
      )
  }

  return output
}

function solveQuiz1(data) {
  const { algo, image } = data
  const output = convolve(image, algo, 2)

  // debugImage(output)
  console.log(
    'Quiz1: ', output.values.filter(v => v === '#').length
  )
}

function solveQuiz2(data) {
  const { algo, image } = data
  const output = convolve(image, algo, 50)

  // debugImage(output)
  console.log(
    'Quiz2: ', output.values.filter(v => v === '#').length
  )
}

async function main() {
  const data = await readData('./main.input')
  solveQuiz1(data)
  solveQuiz2(data)
}
main()
