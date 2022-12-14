package main

import (
	"fmt"
	"os"
	"time"
)

type StacksOfCrates struct {
	stacks []int
	crates []int
	values []byte
	index  int
}

func read_stacks_of_crates(datastream []byte) StacksOfCrates {
	// stacks
	stacks := []int{}
	// crates
	crates := []int{}
	// crates character values
	values := []byte{}

	size := 0
	index := 1
	for stack, ok := 0, true; ok; index += 4 {
		// stop reading crates when we reach the number 1 stack index
		// which wil be the line with all the stack indexes
		if datastream[index] == 49 {
			break
		}

		// only process value if in the char range A..Z
		value := datastream[index]
		if value >= 65 && value <= 90 {
			// append missing stack indexes dynamically
			if size < (stack + 1) {
				for i, N := 0, (stack-size)+1; i < N; i++ {
					stacks = append(stacks, -1)
					size = size + 1
				}
			}

			// append new crate onto the stacks lists
			crates = append(crates, -1)

			// append corresponding value at same index
			values = append(values, value)

			// resolve head
			head := stacks[stack]

			// resolve tail
			tail := len(crates) - 1

			// no previous header set new head
			if head == -1 {
				stacks[stack] = tail
			} else {
				for ptr, ok := head, true; ok; ptr = crates[ptr] {
					// update ptr to point to new tail
					if crates[ptr] == -1 {
						crates[ptr] = tail
						break
					}
				}
			}
		}

		// set crate index
		if datastream[index+2] == 10 {
			stack = 0
		} else {
			stack++
		}
	}

	for ok := true; ok; index++ {
		// stop when next char is 'm' with ascii code 49
		// which is the start of the word move
		if datastream[index+1] == 109 {
			break
		}
	}

	return StacksOfCrates{stacks, crates, values, index}
}

func solve_part_one(data StacksOfCrates, datastream []byte) string {
	stacks := make([]int, len(data.stacks))
	copy(stacks, data.stacks)
	crates := make([]int, len(data.crates))
	copy(crates, data.crates)

	N := len(datastream)
	offset := 48
	for index, ok := data.index, true; ok; {
		index += 6
		// read moves
		moves := int(datastream[index]) - offset
		if datastream[index+1] > 32 {
			index += 1
			moves *= 10
			moves += int(datastream[index]) - offset
		}
		if datastream[index+1] > 32 {
			index += 1
			moves *= 10
			moves += int(datastream[index]) - offset
		}
		if datastream[index+1] > 32 {
			index += 1
			moves *= 10
			moves += int(datastream[index]) - offset
		}
		index += 7

		// read from
		from := int(datastream[index]) - offset
		if datastream[index+1] > 32 {
			index += 1
			from *= 10
			from += int(datastream[index]) - offset
		}
		if datastream[index+1] > 32 {
			index += 1
			from *= 10
			from += int(datastream[index]) - offset
		}
		index += 5

		// read to
		to := int(datastream[index]) - offset
		if ((index + 1) < N) && datastream[index+1] > 32 {
			index += 1
			to *= 10
			to += int(datastream[index]) - offset
		}
		if ((index + 1) < N) && datastream[index+1] > 32 {
			index += 1
			to *= 10
			to += int(datastream[index]) - offset
		}
		index += 1

		// from and to are zero based indexes
		// move one and one crate from one stack to another
		for m, M := 0, moves; m < M; m++ {
			// store position in stack
			tmp := stacks[from-1]
			// set new head to what the tmp stack pointed to
			stacks[from-1] = crates[tmp]

			// update stack to point current head in dst stack
			crates[tmp] = stacks[to-1]
			// set new dst header
			stacks[to-1] = tmp
		}

		if (index + 6) > N {
			break
		}
	}

	args := make([]byte, len(stacks))
	for i, head := range stacks {
		args[i] = data.values[head]
	}

	return string(args[:])
}

func solve_part_two(data StacksOfCrates, datastream []byte) string {
	stacks := make([]int, len(data.stacks))
	copy(stacks, data.stacks)
	crates := make([]int, len(data.crates))
	copy(crates, data.crates)

	N := len(datastream)
	offset := 48
	for index, ok := data.index, true; ok; {
		index += 6
		// read moves
		moves := int(datastream[index]) - offset
		if datastream[index+1] > 32 {
			index += 1
			moves *= 10
			moves += int(datastream[index]) - offset
		}
		if datastream[index+1] > 32 {
			index += 1
			moves *= 10
			moves += int(datastream[index]) - offset
		}
		if datastream[index+1] > 32 {
			index += 1
			moves *= 10
			moves += int(datastream[index]) - offset
		}
		index += 7

		// read from
		from := int(datastream[index]) - offset
		if datastream[index+1] > 32 {
			index += 1
			from *= 10
			from += int(datastream[index]) - offset
		}
		if datastream[index+1] > 32 {
			index += 1
			from *= 10
			from += int(datastream[index]) - offset
		}
		index += 5

		// read to
		to := int(datastream[index]) - offset
		if ((index + 1) < N) && datastream[index+1] > 32 {
			index += 1
			to *= 10
			to += int(datastream[index]) - offset
		}
		if ((index + 1) < N) && datastream[index+1] > 32 {
			index += 1
			to *= 10
			to += int(datastream[index]) - offset
		}
		index += 1

		// from and to are zero based indexes
		// find start:end slice of crates that we are moving from one stack to another
		start := stacks[from-1]
		end := start
		for m, M := 0, (moves - 1); m < M; m++ {
			end = crates[end]
		}
		stacks[from-1] = crates[end]
		crates[end] = stacks[to-1]
		stacks[to-1] = start

		if (index + 6) > N {
			break
		}
	}

	args := make([]byte, len(stacks))
	for i, head := range stacks {
		args[i] = data.values[head]
	}

	return string(args[:])
}

// run with
// > go run main.go
func main() {
	/*
		url:          https://0x0.st/okDo.txt.7z
		bytes:        113M
		crates:       10K
		stacks:       200
		instructions: 5M
		silver: QXWMZOHQIIZEXDCDVRDNYITZTKISAVCDLWNKVBQNGFDXXZKZRUOQAMKJOFOPFFTWQIIVMFOOSGTCLHPXNVRRUIBBPSHGFGULNFAUDSAVQDOMYTPVITJAPYJHZLXGEXCQUGXAPFUCPOZJUDLJSWEJPHWCDWKARGOPMKZRHVDUTHVAVXNUWOODGHEXBIXORGRWPTOPQHEW
		gold: MPRUXFCQFSPJULHGIRCZXCLTVKNUSSCDVWTWOUHSIEBAXFCRMUVZAMBDGLMPCAUXQAIVOXFCSPBTRIPBNKAUKIKBAVNKWKBBDDSIAQNXQJQTKLSNQXMJYIJXAHBEGSJWIAFADPGBECLDRJVRZCVKGHWVZMBAOGGGHAARNZOWPISKTVNUMKACYHXXACEMTGBTTWYPUWSD
	*/
	start := time.Now()
	datastream, _ := os.ReadFile("bigboy.txt")
	fmt.Printf("Read bytes (total: %d) (took: %s)\n", len(datastream), time.Since(start))

	start = time.Now()
	data := read_stacks_of_crates(datastream)
	fmt.Printf("Reading Crates (stacks: %d) (crates: %d) (took: %s)\n", len(data.stacks), len(data.crates), time.Since(start))

	start = time.Now()
	fmt.Printf("Solution 1: %s (took: %s)\n", solve_part_one(data, datastream), time.Since(start))

	start = time.Now()
	fmt.Printf("Solution 2: %s (took: %s)\n", solve_part_two(data, datastream), time.Since(start))
}
