def read_values(filename: str) -> list[str]:
    values = []
    for line in open(filename).readlines():
        values.append(
            line.strip()
        )

    return values

def get_solution_lut_solution_one() -> dict[str, int]:
    return {
        # rock = rock
        "A X": 1 + 3,
        # paper > rock
        "B X": 1 + 0,
        # scissor < rock
        "C X": 1 + 6,
        
        # rock < paper
        "A Y": 2 + 6,
        # paper = paper
        "B Y": 2 + 3,
        # scissor > paper
        "C Y": 2 + 0,

        # rock > scissor
        "A Z": 3 + 0,
        # paper < scissor
        "B Z": 3 + 6,
        # scissor = scissor
        "C Z": 3 + 3,    
    }

def get_solution_lut_solution_two() -> dict[str, int]:
    return {
        # loose => rock > scissor
        "A X": 3 + 0,
        # draw  => rock = rock
        "A Y": 1 + 3,
        # win   => rock < paper
        "A Z": 2 + 6,

        # loose => paper > rock
        "B X": 1 + 0,
        # draw  => paper = paper
        "B Y": 2 + 3,
        # win   => paper < scissor
        "B Z": 3 + 6,

        # loose => scissor > paper
        "C X": 2 + 0,
        # draw  => scissor = scissor
        "C Y": 3 + 3,
        # win   => scissor < rock
        "C Z": 1 + 6,  
    }

def solve_strategy(values: list[str], lut: dict[str, int]) -> int:
    return sum([lut[value] for value in values])

def main():
    values = read_values("input.txt")

    print(f"Solution 1: {solve_strategy(values, get_solution_lut_solution_one())}")
    print(f"Solution 2: {solve_strategy(values, get_solution_lut_solution_two())}")

    
if __name__ == "__main__":
    main()