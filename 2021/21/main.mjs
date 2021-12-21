class Player {
  #pos
  #score
  constructor(pos = 1, score = 0) {
    this.#pos   = pos
    this.#score = score
  }

  get pos() {
    return this.#pos
  }

  get score() {
    return this.#score
  }

  move(moves) {
    this.#pos   += moves
    this.#score += (
      (this.#pos % 10) === 0
        ? 10
        : this.#pos % 10
    )
  }
}

class DeterministicDie {
  static #pos    = 1
  static #rolled = 0
  static get rolled() { return this.#rolled }

  static roll() {
    this.#rolled += 3
    this.#pos = (this.#pos + 3) > 100
      ? (this.#pos + 3) % 100
      : this.#pos + 3
    return (this.#pos - 3) + (this.#pos - 2) + (this.#pos - 1)
  }
}

class QuantumDie {
  static #outcomes = new Map([
    [3, 1],
    [4, 3],
    [5, 6],
    [6, 7],
    [7, 6],
    [8, 3],
    [9, 1]
  ])

  static #cache = {}

  static simulate(pos, otherPos, score, otherScore) {
    if (score > 20)  {
      return [1, 0]
    }

    if (otherScore > 20) {
      return [0, 1]
    }

    const key = `${pos},${otherPos},${score},${otherScore}`
    if (this.#cache[key]) {
      return this.#cache[key]
    }

    const res = [0, 0]
    for (const [roll, additional] of this.#outcomes.entries()) {
      const wins = QuantumDie.simulate(
        otherPos,
        (pos + roll) % 10,
        otherScore,
        score + ((pos + roll) % 10) + 1
      )

      res[0] += wins[1] * additional
      res[1] += wins[0] * additional
    }

    this.#cache[key] = res
    return res
  }
}

function solveQuiz1() {
  /*
    My Input:
      Player 1 starting position: 6
      Player 2 starting position: 1
  */
  const players = [
    new Player(6),
    new Player(1),
  ]

  let index = 0
  do {
    let moves = DeterministicDie.roll()
    players[index++ % 2].move(moves)
  } while (players[0].score < 1000 && players[1].score < 1000)

  let min = Math.min(players[0].score, players[1].score)
  console.log('Quiz1:', DeterministicDie.rolled * min)
}

function solveQuiz2() {
  const players = [
    new Player(6),
    new Player(1),
  ]

  const [universes, otherUniverses] = QuantumDie.simulate(
    players[0].pos - 1,
    players[1].pos - 1,
    players[0].score,
    players[1].score
  )
  console.log(`Quiz2: ${Math.max(universes, otherUniverses)}`)
}

function main () {
  solveQuiz1()
  solveQuiz2()
}

main()
