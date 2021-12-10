import fs from 'fs/promises'

function readData() {
  return fs.readFile('./input.txt', 'utf-8')
    .then(
      contents => contents.trim().split(',').map(value => Number(value))
    )
}

function solveQuiz1(fishes) {
  for (let i = 0, days = 80; i < days; i++) {
    for (let j = 0, total = fishes.length; j < total; j++) {
      if (fishes[j] === 0) {
        fishes[j] = 6
        fishes.push(8)
      } else {
        fishes[j]--
      }
    }
  }

  console.log(fishes.length)
}

// Slow this could be threaded…
// Perhaps use some form of permutation calculation?
function solveQuiz2(fishes) {
  const days = 256

  const lifecycle =
    (timer, days, interval) => {
      let sum = 1
      for (let i = timer; i < days; i = i + interval) {
        // new timer is set to 9 because a new one is spawned after 8 days
        // and timer resets on next day
        sum += lifecycle(i + 9, days, interval)
      }

      return sum
    }

  const total = fishes.reduce(
    (sum, fish) => sum + lifecycle(fish, days, 7),
    0
  )

  console.log('total', total)
}

const NEW_FISH_TIMER_START = 8;
const OLD_FISH_TIMER_START = 6;

function runSimulation(fish, days) {
  const timers = new Array(NEW_FISH_TIMER_START + 1).fill(0);

  for (const spawnTime of fish) {
    timers[spawnTime]++;
  }

  for (let i = 0; i < days; i++) {
    const spawningFish = timers.shift();
    timers[OLD_FISH_TIMER_START] += spawningFish;
    timers.push(spawningFish);
  }

  return timers.reduce((sum, value) => value + sum, 0);
}

function simulate(fishes, days) {
  const timers = Array(8 + 1).fill(0);
  for (const fish of fishes) {
    timers[fish]++
  }

  for (let i = 0; i < days; i++) {
    timers[(7 + i) % timers.length] += timers[i % timers.length]
  }

  return timers.reduce((sum, value) => sum + value, 0)
}

async function main() {
  const fishes = await readData()
  // solveQuiz1(fishes)
  // solveQuiz2(fishes)
  console.log(runSimulation(fishes, 256))
  // console.log(runSimulation(fishes, 80))
  // console.log(simulate(fishes, 256))
  // console.log(simulate(fishes, 256))
}

main()
