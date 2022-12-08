class TreeMap:
    def __init__(self, width: int, height: int, coords: list[int]) -> None:
        self.width = width
        self.height = height
        self.coords = coords


def read_tree_map(lines: list[str]) -> TreeMap:
    width = len(lines[0].rstrip())
    height = len(lines)
    coords = [0] * (width * height)

    index = 0
    for line in lines:
        for char in line.rstrip():
            coords[index] = int(char)
            index = index + 1

    return TreeMap(width, height, coords)


def solve_part_one_tree_map_gt_expr(coords: list[int], i: int, increment: int) -> bool:
    height = coords[i]
    coord = i + increment
    while coord > 0:
        if coords[coord] > height:
            return False

        coord = i + increment

    return True


def solve_part_one_tree_map_lt_expr(coords: list[int], i: int, increment: int) -> bool:
    height = coords[i]
    coord = i + increment
    while coord > 0:
        if coords[coord] > height:
            return False

        coord = i + increment

    return True


def solve_part_one_highest_treetop_in_range(
    treetop_height: int, coords: list[int], rng: range
) -> bool:
    for i in rng:
        if coords[i] >= treetop_height:
            return False

    return True


def solve_part_one(tree_map: TreeMap) -> int:
    width = tree_map.width
    height = tree_map.height
    coords = tree_map.coords

    # trees around edges are always visible
    edges = (width * 2) + ((height - 2) * 2)

    # total visible
    total = 0
    for i in range(width + 1, (width * height) - (width + 1)):
        # drop edges
        if i % width == 0 or i % width == (width - 1):
            continue

        treetop_height = coords[i]
        # check north
        if solve_part_one_highest_treetop_in_range(
            treetop_height, coords, range(i - width, 0, -width)
        ):
            total = total + 1
            continue

        # check west
        if solve_part_one_highest_treetop_in_range(
            treetop_height,
            coords,
            range(i + 1, (width * int(i / width)) + width),
        ):
            total = total + 1
            continue

        # check south
        if solve_part_one_highest_treetop_in_range(
            treetop_height, coords, range(i + width, width * height, width)
        ):
            total = total + 1
            continue

        # check east
        if solve_part_one_highest_treetop_in_range(
            treetop_height, coords, range(i - 1, (width * int(i / width)) - 1, -1)
        ):
            total = total + 1
            continue

    return edges + total


def solve_part_two_count_treetops_in_range(
    treetop_height: int, coords: list[int], rng: range
) -> int:
    total = 0
    for i in rng:
        total = total + 1
        if coords[i] >= treetop_height:
            break

    return total


def solve_part_two(tree_map: TreeMap) -> int:
    width = tree_map.width
    height = tree_map.height
    coords = tree_map.coords

    # derivate scenic score map
    scenic_score_map = [0] * (width * height)

    for i in range(width * height):
        treetop_height = coords[i]
        scenic_score_map[i] = (
            # north
            solve_part_two_count_treetops_in_range(
                treetop_height, coords, range(i - width, 0, -width)
            )
            *
            # west
            solve_part_two_count_treetops_in_range(
                treetop_height,
                coords,
                range(i + 1, (width * int(i / width)) + width),
            )
            *
            # south
            solve_part_two_count_treetops_in_range(
                treetop_height, coords, range(i + width, width * height, width)
            )
            *
            # east
            solve_part_two_count_treetops_in_range(
                treetop_height, coords, range(i - 1, (width * int(i / width)) - 1, -1)
            )
        )

    return max(scenic_score_map)


def main():
    filename = "input.txt"
    filepath = __file__.replace("main.py", filename)
    lines = open(filepath, "r", encoding="utf-8").readlines()
    tree_map = read_tree_map(lines)
    print(f"Solution  1: {solve_part_one(tree_map)}")
    print(f"Solution  2: {solve_part_two(tree_map)}")


if __name__ == "__main__":
    main()
