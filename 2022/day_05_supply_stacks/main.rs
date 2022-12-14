#![allow(non_snake_case)]
use std::ops::Range;
use std::time::Instant;
use std::fs;
use std::fs::File;
use std::io::Read;

struct StacksOfCrates {
    stacks: Vec<usize>,
    crates: Vec<usize>,
	  values: Vec<u8>,
    index: usize
}

fn read_file(filename: &str) -> Vec<u8> {
    let mut f = File::open(&filename).expect("no file found");
    let metadata = fs::metadata(&filename).expect("unable to read metadata");
    let mut buffer = vec![0; metadata.len() as usize];
    f.read(&mut buffer).expect("buffer overflow");
    
    buffer
}

unsafe fn read_stacks_of_crates(datastream: &Vec<u8>) -> StacksOfCrates {
    // stacks
    let mut stacks: Vec<usize> = Vec::new();
    // crates
    let mut crates: Vec<usize> = Vec::new();
    // crates character value
    let mut values: Vec<u8> = Vec::new();

    let mut index:usize = 1;
    let mut size:usize = 0;
    let mut stack:usize = 0;
    let ok = true;
    while ok {
        // stop reading crates when we reach the number 1 stack index
        // which wil be the line with all the stack indexes
        if *datastream.get_unchecked(index) == 49 {
            break
        }

        let value = *datastream.get_unchecked(index);
        if value >= 65 && value <= 90 {
            // append missing stack indexes dynamically
            if size < (stack + 1) {
                for _ in (Range{ start: 0, end: (stack-size)+1}) {
                    stacks.push(usize::MAX);
                    size += 1;
                }
            }

            // append new crate onto the crates lists
            crates.push(usize::MAX);

            // append corresponding value at same index
            values.push(value);

            // resolve head
            let head = stacks[stack];

            // resolve tail
            let tail = crates.len() - 1;

            // no previous header set new head
            if head == usize::MAX {
                stacks[stack] = tail
            } else {
                // update ptr to point to new tail
                let mut ptr = head;
                let ok = true;
                while ok {
                    if crates[ptr] == usize::MAX {
                        crates[ptr] = tail;
                        break;
                    }

                    ptr = crates[ptr];
                }
            }
        }
        // set crate index
        if *datastream.get_unchecked(index+2) == 10 {
            stack = 0;
        } else {
            stack += 1;
        }
        index += 4;
    }

    let ok = true;
    while ok {
        // stop when next char is 'm' with ascii code 49
        // which is the start of the word move
        if datastream[index+1] == 109 {
            break
        }
        index += 1;
    }
    StacksOfCrates { stacks,  crates,  values, index }
}

unsafe fn solve_part_one(data: &StacksOfCrates, datastream: &Vec<u8>) -> String {
    let mut stacks: Vec<usize> = data.stacks.to_vec();
    let mut crates: Vec<usize> = data.crates.to_vec();

    let offset:usize = 48;
    let space:u8 = 32;

    let mut index = data.index;
    let N = datastream.len();
    let ok = true;
    while ok {
        index += 6;
        
        // read moves
        let mut moves:usize = (*datastream.get_unchecked(index) as usize) - offset;
        if *datastream.get_unchecked(index + 1) > space {
            index += 1;
            moves *= 10;
            moves += (*datastream.get_unchecked(index) as usize) - offset;
        }
        if *datastream.get_unchecked(index + 1) > space {
            index += 1;
            moves *= 10;
            moves += (*datastream.get_unchecked(index) as usize) - offset;
        }
        if *datastream.get_unchecked(index + 1) > space {
            index += 1;
            moves *= 10;
            moves += (*datastream.get_unchecked(index) as usize) - offset;
        }
        index += 7;

        // read from
        let mut from = (*datastream.get_unchecked(index)) as usize - offset;
        if *datastream.get_unchecked(index + 1) > space {
            index += 1;
            from *= 10;
            from += (*datastream.get_unchecked(index) as usize) - offset;
        }
        if *datastream.get_unchecked(index + 1) > space {
            index += 1;
            from *= 10;
            from += (*datastream.get_unchecked(index) as usize) - offset;
        }
        index += 5;
        
        // read to
        let mut to = (*datastream.get_unchecked(index)) as usize - offset;
        if *datastream.get_unchecked(index + 1) > space {
            index += 1;
            to *= 10;
            to += (*datastream.get_unchecked(index)) as usize - offset;
        }
        if *datastream.get_unchecked(index + 1)> space {
            index += 1;
            to *= 10;
            to += (*datastream.get_unchecked(index)) as usize - offset;
        }
        index += 1;

        // from and to are zero based indexes
        // move one and one crate from one stack to another
        let mut m = 0;
        let M = moves;
        while m < M {
            // store position in stack
            let tmp = stacks[from-1];
            // set new head to what the tmp stack pointed to
            stacks[from-1] = crates[tmp];

            // update stack to point current head in dst stack
            crates[tmp] = stacks[to-1];
            // set new dst header
            stacks[to-1] = tmp;
            
            m += 1;
        }

        if (index + 6) > N {
            break
        }
    }

    let mut args: Vec<u8> = Vec::new();
    for stack in stacks {
        args.push(data.values[stack]);
    }

    return String::from_utf8(args).expect("Found invalid UTF-8");
}

unsafe fn solve_part_two(data: &StacksOfCrates, datastream: &Vec<u8>) -> String {
    let mut stacks: Vec<usize> = data.stacks.to_vec();
    let mut crates: Vec<usize> = data.crates.to_vec();

    let offset:usize = 48;
    let space:u8 = 32;

    let mut index = data.index;
    let N = datastream.len();
    let ok = true;
    while ok {
        index += 6;
        
        // read moves
        let mut moves:usize = (*datastream.get_unchecked(index) as usize) - offset;
        if *datastream.get_unchecked(index + 1) > space {
            index += 1;
            moves *= 10;
            moves += (*datastream.get_unchecked(index) as usize) - offset;
        }
        if *datastream.get_unchecked(index + 1) > space {
            index += 1;
            moves *= 10;
            moves += (*datastream.get_unchecked(index) as usize) - offset;
        }
        if *datastream.get_unchecked(index + 1) > space {
            index += 1;
            moves *= 10;
            moves += (*datastream.get_unchecked(index) as usize) - offset;
        }
        index += 7;

        // read from
        let mut from = (*datastream.get_unchecked(index)) as usize - offset;
        if *datastream.get_unchecked(index + 1) > space {
            index += 1;
            from *= 10;
            from += (*datastream.get_unchecked(index) as usize) - offset;
        }
        if *datastream.get_unchecked(index + 1) > space {
            index += 1;
            from *= 10;
            from += (*datastream.get_unchecked(index) as usize) - offset;
        }
        index += 5;
        
        // read to
        let mut to = (*datastream.get_unchecked(index)) as usize - offset;
        if *datastream.get_unchecked(index + 1) > space {
            index += 1;
            to *= 10;
            to += (*datastream.get_unchecked(index)) as usize - offset;
        }
        if *datastream.get_unchecked(index + 1)> space {
            index += 1;
            to *= 10;
            to += (*datastream.get_unchecked(index)) as usize - offset;
        }
        index += 1;

        // from and to are zero based indexes
        // find start:end slice of crates that we are moving from one stack to another
        let start = stacks[from-1];
        let mut end = start;
        let mut m = 0;
        let M = moves - 1;
        while m < M {
            end = crates[end];
            m += 1;
        }
        stacks[from-1] = crates[end];
        crates[end] = stacks[to-1];
        stacks[to-1] = start;

        if (index + 6) > N {
            break
        }
    }

    let mut args: Vec<u8> = Vec::new();
    for stack in stacks {
        args.push(data.values[stack]);
    }

    return String::from_utf8(args).expect("Found invalid UTF-8");
}

fn main() {
    
    /*
        url:          https://0x0.st/okDo.txt.7z
        bytes:        113M
        crates:       10K
        stacks:       200
        instructions: 5M
        silver: QXWMZOHQIIZEXDCDVRDNYITZTKISAVCDLWNKVBQNGFDXXZKZRUOQAMKJOFOPFFTWQIIVMFOOSGTCLHPXNVRRUIBBPSHGFGULNFAUDSAVQDOMYTPVITJAPYJHZLXGEXCQUGXAPFUCPOZJUDLJSWEJPHWCDWKARGOPMKZRHVDUTHVAVXNUWOODGHEXBIXORGRWPTOPQHEW
        gold: MPRUXFCQFSPJULHGIRCZXCLTVKNUSSCDVWTWOUHSIEBAXFCRMUVZAMBDGLMPCAUXQAIVOXFCSPBTRIPBNKAUKIKBAVNKWKBBDDSIAQNXQJQTKLSNQXMJYIJXAHBEGSJWIAFADPGBECLDRJVRZCVKGHWVZMBAOGGGHAARNZOWPISKTVNUMKACYHXXACEMTGBTTWYPUWSD
	  */
    let filename: String = String::from("bigboy.txt");
    
    let mut start = Instant::now();
    let datastream = read_file(&filename);
    println!("Read file (took: {:?})", start.elapsed());
    
    unsafe {
        start = Instant::now();
        let data = read_stacks_of_crates(&datastream);
        println!("Reading crates  (stacks: {}) (crates: {}) (took: {:?})", data.stacks.len(), data.crates.len(), start.elapsed());
    
        start = Instant::now();
        println!("Solution 1: {} (took: {:?})", solve_part_one(&data, &datastream), start.elapsed());
        
        start = Instant::now();
        println!("Solution 2: {} (took: {:?})", solve_part_two(&data, &datastream), start.elapsed());

    }
}
