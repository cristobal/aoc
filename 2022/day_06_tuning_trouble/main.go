package main

import (
	"encoding/binary"
	"fmt"
	"os"
	"time"
)

func find_marker(datastream []byte, window_size int) int {
	// b'a' => 97
	offset := 97
	// counter table for how many times we have seen each character
	counter := [26]int{}
	// initialize every counter[char] to zero
	for _, char := range "abcdefghijklmnopqrstuvwxyz" {
		counter[int(char)-offset] = 0
	}

	// count unique characters seen
	unique := 0

	// set up start window from 0..window_size
	pos := 0
	for pos < window_size {
		char := int(datastream[pos]) - offset
		counter[char] = counter[char] + 1
		if counter[char] == 1 {
			unique++
		}
		pos++
	}

	size := binary.Size(datastream)
	for pos < size {
		// cleanup
		old_char := int(datastream[pos-window_size]) - offset
		counter[old_char] = counter[old_char] - 1
		if counter[old_char] == 0 {
			unique--
		}

		char := int(datastream[pos]) - offset
		counter[char] = counter[char] + 1
		if counter[char] == 1 {
			unique++
		}

		// terminal symbol unique characters matches window_size
		if unique == window_size {
			return pos + 1
		}

		pos++
	}

	return -1
}

// run with
// > go run main.go
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
