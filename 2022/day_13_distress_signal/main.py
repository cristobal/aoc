from copy import deepcopy
from functools import cmp_to_key
from typing import NamedTuple, Union


class Pair(NamedTuple):
    left: str
    right: str


def read_pairs(lines: list[str]) -> list[Pair]:
    pairs: list[Pair] = []
    for i in range(0, len(lines), 3):
        pairs.append(Pair(lines[i].rstrip(), lines[i + 1].rstrip()))

    return pairs


def solve_part_one_solver(
    left: Union[list, list[int]], right: Union[list, list[int]]
) -> int:
    for i in range(0, max(len(left), len(right))):
        left_size = len(left)
        right_size = len(right)

        # left ran out and is empty
        if left_size == 0 and right_size > 0:
            return 1
        # right ran out and is empty
        if left_size > 0 and right_size == 0:
            return -1
        # both are empty, continue
        if left_size == 0 and right_size == 0:
            return 0

        left_value = left.pop(0)
        right_value = right.pop(0)

        left_value_is_list = isinstance(left_value, list)
        right_value_is_list = isinstance(right_value, list)
        if left_value_is_list or right_value_is_list:
            index = solve_part_one_solver(
                left_value if left_value_is_list else [left_value],
                right_value if right_value_is_list else [right_value],
            )
            if index == 0:
                # print("continue")
                continue

            return index

        if left_value < right_value:
            return 1

        if left_value == right_value:
            continue

        if left_value > right_value:
            return -1
    return 0


def solve_part_one(pairs: list[Pair]) -> int:
    return sum(
        [
            index + 1 if value > 0 else 0
            for index, value in enumerate(
                [
                    solve_part_one_solver(eval(pair.left), eval(pair.right))
                    for pair in pairs
                ]
            )
        ]
    )


def solve_part_two_solver(
    left: Union[list, list[int]], right: Union[list, list[int]]
) -> int:
    # print((left, right))
    return solve_part_one_solver(deepcopy(left), deepcopy(right))


def solve_part_two(pairs: list[Pair]) -> int:

    items = [[[2]], [[6]]]
    for pair in pairs:
        items.append(eval(pair.left))
        items.append(eval(pair.right))

    items.sort(key=cmp_to_key(solve_part_two_solver), reverse=True)

    one = 0
    two = 0
    for index, value in enumerate(items):
        if str(value) == "[[2]]":
            one = index + 1
        if str(value) == "[[6]]":
            two = index + 1

    return one * two


def main():
    filename = "input.txt"
    filepath = __file__.replace("main.py", filename)
    lines = open(filepath, "r", encoding="utf-8").readlines()
    pairs = read_pairs(lines)
    print(f"Solution 1: {solve_part_one(pairs)}")
    print(f"Solution 2: {solve_part_two(pairs)}")
    pass


if __name__ == "__main__":
    main()
