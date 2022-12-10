package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"
)

type Crates struct {
	headers []int
	stacks  []int
	values  []byte
	index   int
}

func read_crates(lines []string) Crates {
	prog := regexp.MustCompile("[A-Z]")

	// crates headers
	headers := []int{}
	// crates stacks
	stacks := []int{}
	// crates character value
	values := []byte{}

	size := 0
	index := 0
	for ok := true; ok; index++ {
		line := lines[index]
		if prog.MatchString(line) == false && strings.TrimSuffix(line, "\n") == "" {
			break
		}

		for _, match := range prog.FindAllStringIndex(line, -1) {
			start := match[0]
			crate := int((start - 1) / 4)

			// append missing crates indexes dynamically
			if size < (crate + 1) {
				for i, N := 0, (crate-size)+1; i < N; i++ {
					headers = append(headers, -1)
					size = size + 1
				}
			}

			// append new crate onto the stacks lists
			stacks = append(stacks, -1)

			// append corresponding value at same index
			values = append(values, line[start])

			// resolve head
			head := headers[crate]

			// resolve tail
			tail := len(stacks) - 1

			// no previous header set new head
			if head == -1 {
				headers[crate] = tail
				continue
			}

			for ptr, ok := head, true; ok; ptr = stacks[ptr] {
				// update ptr to point to new tail
				if stacks[ptr] == -1 {
					stacks[ptr] = tail
					break
				}
			}
		}
	}

	return Crates{headers, stacks, values, index + 1}
}

func read_lines(path string) ([]string, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	lines := []string{}
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	return lines, scanner.Err()
}

func solve_part_one(crates Crates, lines []string) string {
	// prog := regexp.MustCompile("\\d+")

	headers := make([]int, len(crates.headers))
	copy(headers, crates.headers)
	stacks := make([]int, len(crates.stacks))
	copy(stacks, crates.stacks)

	for i, N := crates.index, len(lines); i < N; i++ {
		// args := prog.FindAllString(lines[i], -1)
		args := strings.Fields(lines[i])
		moves, _ := strconv.Atoi(args[0])
		src_head, _ := strconv.Atoi(args[1])
		src_head--
		dst_head, _ := strconv.Atoi(args[2])
		dst_head--
		// fmt.Println(moves, src_head, dst_head)
		for m, M := 0, moves; m < M; m++ {
			// store position in stack
			tmp := headers[src_head]
			// set new head to what the tmp stack pointed to
			headers[src_head] = stacks[tmp]

			// update stack to point current head in dst stack
			stacks[tmp] = headers[dst_head]
			// set new dst header
			headers[dst_head] = tmp
		}
	}

	args := make([]byte, len(headers))
	for i, head := range headers {
		args[i] = crates.values[head]
	}

	return string(args[:])
}

// run with
// > go run main.go
func main() {
	/*
	   url:    https://0x0.st/okDo.txt.7z
	   bytes:  96M
	   silver: 85760445
	   gold:   91845017
	*/
	start := time.Now()
	lines, _ := read_lines("bigboy.txt")
	fmt.Printf("Read file (lines: %d) (took: %s)\n", len(lines), time.Since(start))

	start = time.Now()
	crates := read_crates(lines)
	fmt.Printf("Reading Creates (took: %s)\n", time.Since(start))

	start = time.Now()
	fmt.Printf("solve_part_one(crates, lines) => %s (took: %s)\n", solve_part_one(crates, lines), time.Since(start))
}
