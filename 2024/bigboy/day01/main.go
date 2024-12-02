package main

import (
	"fmt"
	"os"
	//"sort"
	"sync"
	"time"
)

func radixSort(arr []int) {
    if len(arr) == 0 {
        return
    }
    maxVal := arr[0]
    for _, num := range arr {
        if num > maxVal {
            maxVal = num
        }
    }
    
    exp := 1
    for maxVal/exp > 0 {
        countSort(arr, exp)
        exp *= 10
    }
}

func countSort(arr []int, exp int) {
    n := len(arr)
    output := make([]int, n)
    count := make([]int, 10)
    
    for i := 0; i < n; i++ {
        count[(arr[i]/exp)%10]++
    }
    
    for i := 1; i < 10; i++ {
        count[i] += count[i-1]
    }
    
    for i := n - 1; i >= 0; i-- {
        output[count[(arr[i]/exp)%10]-1] = arr[i]
        count[(arr[i]/exp)%10]--
    }
    
    copy(arr, output)
}

func main() {
	start := time.Now()
	datastream, _ := os.ReadFile("bigboy.txt")
	fmt.Printf("Read bytes (total: %d) (took: %s)\n", len(datastream), time.Since(start))

	start = time.Now()

	const N = 4_000_000
	left, right   := make([]int, N), make([]int, N)
	index, offset := 0, 0
	for index < N {
		// substract 48 which is the ascii char for zero
		left[index] =
			(int(datastream[offset + 0]) - 48) * 10_000_000 +
			(int(datastream[offset + 1]) - 48) *  1_000_000 +
			(int(datastream[offset + 2]) - 48) *    100_000 +
			(int(datastream[offset + 3]) - 48) *     10_000 +
			(int(datastream[offset + 4]) - 48) *       1000 +
			(int(datastream[offset + 5]) - 48) *        100 +
			(int(datastream[offset + 6]) - 48) *         10 +
			(int(datastream[offset + 7]) - 48)
		// substract 48 which is the ascii char for zero
		right[index] =
			(int(datastream[offset + 11]) - 48) * 10_000_000 +
			(int(datastream[offset + 12]) - 48) *  1_000_000 +
			(int(datastream[offset + 13]) - 48) *    100_000 +
			(int(datastream[offset + 14]) - 48) *     10_000 +
			(int(datastream[offset + 15]) - 48) *       1000 +
			(int(datastream[offset + 16]) - 48) *        100 +
			(int(datastream[offset + 17]) - 48) *         10 +
			(int(datastream[offset + 18]) - 48)	
		index++
		offset += 20
	}
	fmt.Printf("Read values (total: %d) (took: %s)\n", N, time.Since(start))

	// Calculate distance
	start = time.Now()
	
	// sort lists concurrently
	var wg sync.WaitGroup
	wg.Add(2)
	go func() {
		defer wg.Done()
		radixSort(left)
	}()
	go func() {
		defer wg.Done()
		radixSort(right)
	}()
	wg.Wait()
	// fmt.Printf("Sorting took (total: %d) (took: %s)\n", N, time.Since(start))

	distance := 0
	for i, v := range left {
		diff := v - right[i];
		if diff < 0 {
			distance -= diff
		} else {
			distance += diff
		}
	}
	fmt.Printf("Solution 1: %d (took: %s)\n", distance, time.Since(start))
	
	// calculate score
	start = time.Now()
	lut := make(map[int]int, N)
	for _, value := range right {
		lut[value]++
	}

	score := 0
	for _, value := range left {
		score += value * lut[value]
	}
	fmt.Printf("Solution 2: %d (took: %s)\n", score, time.Since(start))
}
