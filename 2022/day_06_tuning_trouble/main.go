package main

import (
	"encoding/binary"
	"fmt"
	"os"
	"time"
)

func find_marker(datastream []byte, window_size int) int {
	offset := 97
	counter := [26]int{}

	for _, char := range "abcdefghijklmnopqrstuvwxyz" {
		counter[int(char)-offset] = 0
	}

	pos := 0
	total := 0
	for pos < window_size {
		char := int(datastream[pos]) - offset
		counter[char] = counter[char] + 1
		if counter[char] == 1 {
			total++
		}
		pos++
	}

	size := binary.Size(datastream)
	for pos < size {
		// cleanup
		old_char := int(datastream[pos-window_size]) - offset
		counter[old_char] = counter[old_char] - 1
		if counter[old_char] == 0 {
			total--
		}

		char := int(datastream[pos]) - offset
		counter[char] = counter[char] + 1
		if counter[char] == 1 {
			total++
		}

		if total == window_size {
			return pos + 1
		}

		pos++
	}

	return -1
}

func main() {
	/*
	   url:    https://0x0.st/ods8.txt.7z
	   bytes:  96M
	   silver: 85760445
	   gold:   91845017
	*/
	start := time.Now()
	datastream, _ := os.ReadFile("bigboy.txt")
	fmt.Printf("Read file (took: %s)\n", time.Since(start))

	start = time.Now()
	fmt.Printf("find_marker(datastream, 4) => %v (took: %s)\n", find_marker(datastream, 4), time.Since(start))

	start = time.Now()
	fmt.Printf("find_marker(datastream, 14) => %v (took: %s)\n", find_marker(datastream, 14), time.Since(start))
}
