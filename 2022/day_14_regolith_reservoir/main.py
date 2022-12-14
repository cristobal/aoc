from typing import NamedTuple


class Pos(NamedTuple):
    x: int
    y: int


class Path(NamedTuple):
    coords: list[Pos]


class Board(NamedTuple):
    width: int
    height: int
    values: list[str]


def read_paths(lines: list[str]) -> list[Path]:
    paths: list[Path] = []
    for line in lines:
        coords: list[Pos] = []
        for x, y in [arg.split(",") for arg in line.rstrip().split(" -> ")]:
            coords.append(Pos(int(x), int(y)))
        paths.append(Path(coords))

    return paths


def read_board(paths: list[Path]) -> Board:
    # find board width and height
    vx = []
    vy = []
    for path in paths:
        for pos in path.coords:
            vx.append(pos.x)
            vy.append(pos.y)

    sx, ex = [min(vx), max(vx)]
    sy, ey = [0, max(vy)]

    width = (ex - sx) + 1
    height = (ey - sy) + 1
    values = ["."] * (width * height)

    # set +
    values[(500 - sx)] = "+"

    for path in paths:
        coords = path.coords
        for i in range(0, len(coords) - 1):
            x1, y1 = coords[i]
            x2, y2 = coords[i + 1]
            # up or down
            if x1 - x2 == 0:
                x = x1 - sx
                for y in range(min(y1, y2), max(y1, y2) + 1):
                    values[(width * y) + x] = "#"
            # left or right
            else:
                y = y1
                for x in range(
                    0 if (min(x1, x2) - sx) == 0 else (min(x1, x2) - sx),
                    (max(x1, x2) - sx) + 1,
                ):
                    values[(width * y) + x] = "#"

    return Board(width, height, values)


def draw_board(width: int, height: int, values: list[str]):
    for i in range(0, height):
        print("".join(values[i * width : (i * width) + width]))
    print()


def solve_part_one(board: Board, print_board: bool = False) -> int:
    width = board.width
    height = board.height
    values = list(board.values)

    # start x where we drip from
    sx = values.index("+")

    # find first start y pos
    sy = 0
    ok = True
    stop = False
    total = 0
    while ok:
        y = sy
        x = sx
        rest = False
        while not rest:
            # move down until no longer possible
            if (y + 1) >= height:
                stop = True
                break
            pos = ((y + 1) * width) + x
            if values[pos] != "#" and values[pos] != "o":
                y += 1
                continue

            # move to the left if possible
            if ((y + 1) >= height) or (x - 1 < 0):
                stop = True
                break
            pos = ((y + 1) * width) + (x - 1)
            if values[pos] != "#" and values[pos] != "o":
                y += 1
                x -= 1
                continue

            # move to the right if possible
            if ((y + 1) >= height) or (x + 1 >= width):
                stop = True
                break
            pos = ((y + 1) * width) + (x + 1)
            if values[pos] != "#" and values[pos] != "o":
                y += 1
                x += 1
                continue

            rest = True

        if values[sx] == "o":
            break

        if stop:
            break
        values[(y * width) + x] = "o"

    if print_board:
        draw_board(width, height, values)
        print()

    return len(list(filter(lambda v: v == "o", values)))


def solve_part_two(board: Board, print_board: bool = False) -> int:
    # extend current board with 10x and place current board
    # into the middle of the new extend board from the top
    width = board.width
    height = board.height
    values = list(board.values)

    extended_width = (board.width * 10) + (1 if board.width % 2 == 0 else 0)
    extended_height = board.height + 2

    extended_values = ["."] * (extended_width * extended_height)
    midpoint = (extended_width - (1 if board.width % 2 == 0 else 0)) // 2

    offset_x = midpoint - values.index("+")
    for i in range(0, board.width * board.height):
        x = i % board.width
        y = i // board.width

        pos = x + (y * width)
        dpos = offset_x + x + (y * extended_width)

        extended_values[dpos] = values[pos]

    offset = extended_width * (extended_height - 1)
    for x in range(0, extended_width):
        extended_values[offset + x] = "#"

    return solve_part_one(
        Board(extended_width, extended_height, extended_values), print_board
    )


def main():
    filepath = __file__.replace("main.py", "input.txt")
    lines = open(filepath, "r").readlines()
    paths = read_paths(lines)
    board = read_board(paths)
    print(f"Solution 1: {solve_part_one(board, True)}")
    print(f"Solution 2: {solve_part_two(board, False)}")
    pass


if __name__ == "__main__":
    main()
