def read_values(filename: str) -> list[str]:
    values = []
    for line in open(filename).readlines():
        values.append(line.strip())

    return values


def get_solution_lut_solution_one() -> dict[str, int]:
    return {
        # rock outcomes
        "A X": 1 + 3,  # rock = rock
        "B X": 1 + 0,  # paper > rock
        "C X": 1 + 6,  # scissor < rock
        # paper outcomes
        "A Y": 2 + 6,  # rock < paper
        "B Y": 2 + 3,  # paper = paper
        "C Y": 2 + 0,  # scissor > paper
        # scissor outcomes
        "A Z": 3 + 0,  # rock > scissor
        "B Z": 3 + 6,  # paper < scissor
        "C Z": 3 + 3,  # scissor = scissor
    }


def get_solution_lut_solution_two() -> dict[str, int]:
    return {
        # choose type based on outcome for rock
        "A X": 3 + 0,  # loose => rock > scissor
        "A Y": 1 + 3,  # draw  => rock = rock
        "A Z": 2 + 6,  # win   => rock < paper
        # choose type based on outcome for paper
        "B X": 1 + 0,  # loose => paper > rock
        "B Y": 2 + 3,  # draw  => paper = paper
        "B Z": 3 + 6,  # win   => paper < scissor
        # choose type based on outcome for scissor
        "C X": 2 + 0,  # loose => scissor > paper
        "C Y": 3 + 3,  # draw  => scissor = scissor
        "C Z": 1 + 6,  # win   => scissor < rock
    }


def solve_strategy(values: list[str], lut: dict[str, int]) -> int:
    return sum([lut[value] for value in values])


def main():
    values = read_values("input.txt")

    print(f"Solution 1: {solve_strategy(values, get_solution_lut_solution_one())}")
    print(f"Solution 2: {solve_strategy(values, get_solution_lut_solution_two())}")


if __name__ == "__main__":
    main()
