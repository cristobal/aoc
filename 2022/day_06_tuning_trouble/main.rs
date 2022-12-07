use std::time::Instant;
use std::fs;
use std::fs::File;
use std::io::Read;

fn read_file(filename: &str) -> Vec<u8> {
    let mut f = File::open(&filename).expect("no file found");
    let metadata = fs::metadata(&filename).expect("unable to read metadata");
    let mut buffer = vec![0; metadata.len() as usize];
    f.read(&mut buffer).expect("buffer overflow");
    
    buffer
}

unsafe fn find_marker(datastream: &Vec<u8>, window_size: usize) -> u32 {
    // b'a' => 97
    let offset:u8 = 97;
    // counter table for how many times we have seen each character
    let mut counter: [u8; 26] = [0; 26];
    
    
    // count unique characters seen
    let mut unique:usize = 0;

    // set up start window from 0..window_size
    let mut pos:usize = 0;
    while pos < window_size {
        let key:u8 = datastream.get_unchecked(pos) - offset;
        counter[key as usize] += 1;
        if counter[key as usize] == 1 {
			      unique += 1;
		    }

        pos += 1;
    }

    let size = datastream.len();
    while pos < size {
        // cleanup
        let old_key = (datastream.get_unchecked(pos-window_size) - offset) as usize;
        counter[old_key] -= 1;
        if counter[old_key] == 0 {
            unique -= 1;
        }

        let key = (datastream.get_unchecked(pos) - offset) as usize;
        counter[key] += 1;
		    if counter[key] == 1 {
			      unique += 1;
		    }
        
            // terminal symbol unique characters matches window_size
        if unique == window_size {
			      return (pos + 1) as u32
		    }

        pos += 1;
    }

    0
}

// run with:
// $> rustc main.rs --edition 2021 -O  -C opt-level=2 --out-dir  --out-dir ./_dist && ./_dist/main  
fn main() {
    unsafe {
        /*
            url:    https://0x0.st/ods8.txt.7z
            bytes:  96M
            silver: 85760445
            gold:   91845017
        */
        let filename = String::from("bigboy.txt");

        let mut start = Instant::now();
        let datastream = read_file(&filename);
        println!("Read file (took: {:?})", start.elapsed());

        start = Instant::now();
        println!("find_marker(datastream, 4) => {} (took: {:?})", find_marker(&datastream, 4), start.elapsed());

        start = Instant::now();
        println!("find_marker(datastream, 14) => {} (took: {:?})", find_marker(&datastream, 14), start.elapsed());
    }
}
