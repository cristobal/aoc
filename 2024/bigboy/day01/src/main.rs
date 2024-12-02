use std::collections::HashMap;
use std::fs;
use std::time::Instant;
use rayon::prelude::*;

const N: usize = 4_000_000;

fn main() {
    let start = Instant::now();
    let datastream = fs::read("bigboy.txt").expect("Failed to read file");
    println!("Read bytes (total: {}) (took: {:?})", datastream.len(), start.elapsed());

    let start = Instant::now();
    let mut left = vec![0; N];
    let mut right = vec![0; N];
    
    for (index, offset) in (0..N).zip((0..N*20).step_by(20)) {
        // subtract 48 which is the ascii char for zero
        left[index] =
            ((datastream[offset + 0] - 48) as i32) * 10_000_000 +
            ((datastream[offset + 1] - 48) as i32) *  1_000_000 +
            ((datastream[offset + 2] - 48) as i32) *    100_000 +
            ((datastream[offset + 3] - 48) as i32) *     10_000 +
            ((datastream[offset + 4] - 48) as i32) *       1000 +
            ((datastream[offset + 5] - 48) as i32) *        100 +
            ((datastream[offset + 6] - 48) as i32) *         10 +
            ((datastream[offset + 7] - 48) as i32);

        right[index] =
            ((datastream[offset + 11] - 48) as i32) * 10_000_000 +
            ((datastream[offset + 12] - 48) as i32) *  1_000_000 +
            ((datastream[offset + 13] - 48) as i32) *    100_000 +
            ((datastream[offset + 14] - 48) as i32) *     10_000 +
            ((datastream[offset + 15] - 48) as i32) *       1000 +
            ((datastream[offset + 16] - 48) as i32) *        100 +
            ((datastream[offset + 17] - 48) as i32) *         10 +
            ((datastream[offset + 18] - 48) as i32);
    }
    println!("Read values (total: {}) (took: {:?})", N, start.elapsed());

    // Calculate distance
    let start = Instant::now();
    
    // Sort lists in parallel
    left.par_sort_unstable();
    right.par_sort_unstable();

    let distance: i32 = left.iter()
        .zip(right.iter())
        .map(|(a, b)| {
            let diff = a - b;
            if diff < 0 { -diff } else { diff }
        })
        .sum();
    
    println!("Solution 1: {} (took: {:?})", distance, start.elapsed());

    // Calculate score
    let start = Instant::now();
    let mut lut: HashMap<i32, i32> = HashMap::with_capacity(N);
    
    for &value in right.iter() {
        *lut.entry(value).or_insert(0) += 1;
    }

    let score: i64 = left.iter()
        .map(|&value| value as i64 * *lut.get(&value).unwrap_or(&0) as i64)
        .sum();

    println!("Solution 2: {} (took: {:?})", score, start.elapsed());
}
