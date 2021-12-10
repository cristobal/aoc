import fs from 'fs/promises'

async function readData() {
  const lines = await (
    fs.readFile('./input.txt', 'utf-8')
      .then(contents => contents.split('\n'))
  )

  const numbers = lines[0].split(',').map(v => Number(v))
  const boards = []
  const re = /\s{1,2}/
  for (let i = 2, k = lines.length; i < k; i = i + 6) {
    const values = [
      lines[i],
      lines[i + 1],
      lines[i + 2],
      lines[i + 3],
      lines[i + 4]
    ].map(
      line => line
        .split(' ')
        .filter(x => x)
        .map(v => Number(v))
    ).flat()

    boards.push(new Board(values))
  }

  return {
    numbers,
    boards
  }
}

class Board {
  static index = 0;
  constructor(values) {
    this.index  = Board.index++;
    this.values = values;
    this.marked = [...Array(values.length)].map(_ => 0)
  }

  checkNumber(number) {
    const found = this.values.indexOf(number);
    if (found >= 0) {
      this.marked[found] = 1;
    }
  }

  uncheckNumber(number) {
    const found = this.values.indexOf(number);
    if (found >= 0) {
      this.marked[found] = 0;
    }
  }

  unmarked() {
    return this.values.filter(
      (_, index) => (this.marked[index] === 0)
    )
  }

  static checkRows(board) {
    for (let row = 0; row < 5; row++) {
      if (Board.checkRow(board, row)) {
        return row
      }
    }

    return -1
  }

  static checkRow(board, row) {
    return (
      board.marked[row * 5] +
      board.marked[row * 5 + 1] +
      board.marked[row * 5 + 2] +
      board.marked[row * 5 + 3] +
      board.marked[row * 5 + 4]
     ) === 5;
  }

  static checkCols(board) {
    for (let col = 0; col < 5; col++) {
      if (Board.checkCol(board, col)) {
        return col
      }
    }

    return -1
  }

  static checkCol(board, col) {
    return (
      board.marked[col]      +
      board.marked[col + 5]  +
      board.marked[col + 10] +
      board.marked[col + 15] +
      board.marked[col + 20]
    ) === 5;
  }
}

function solveQuiz1(numbers, boards) {
  const data = {
    board: null,
    number: -1
  }

  for (const number of numbers) {
    for (const board of boards) {
      // check if number is present in the board
      board.checkNumber(number);

      // check rows
      if (Board.checkRows(board) >= 0) {
        data.number = number
        data.board = board
        break
      }

      // check cols
      if (Board.checkCols(board) >= 0) {
        data.number = number
        data.board = board
        break
      }
    }

    if (data.board !== null) { break }
  }

  const sum = data.board.unmarked().reduce((c, v) => c + v, 0);
  console.log(data.number * sum)
}

function solveQuiz2(numbers, boards) {
  // play all numbers
  for (const number of numbers) {
    for (const board of boards) {
      board.checkNumber(number)
    }
  }

  // playback numbers in reverse
  const numbersReversed = numbers.concat().reverse();
  const boardsReversed = boards.concat().reverse();
  const data = {
    board: null,
    number: -1
  }


  for (const number of numbersReversed) {
    for (const board of boardsReversed) {
      // uncheck number and check if board no longer has bingo
      board.uncheckNumber(number)
      if (Board.checkRows(board) < 0 && Board.checkCols(board) <= 0) {
        // recheck number to get to last stage
        board.checkNumber(number)
        data.board = board
        data.number = number
        break
      }
    }

    if (data.board !== null) { break }
  }

  const sum = data.board.unmarked().reduce((c, v) => c + v, 0);
  console.log(data.number * sum)
}

async function main() {
  const { numbers, boards } = await readData()
  // solveQuiz1(numbers, boards)
  solveQuiz2(numbers, boards)
}

main()
