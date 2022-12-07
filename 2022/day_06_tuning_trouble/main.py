import time
import string


def find_marker(datastream: str, window_size: int) -> int:
    for i in range(len(datastream)):
        if len(set(datastream[i : (i + window_size)])) == window_size:
            return i + window_size

    return -1


def find_marker_optimized(datastream: str, window_size: int) -> int:
    counter = dict()
    for char in list(string.ascii_lowercase):
        counter[char] = 0

    pos = 0
    total = 0
    for i in range(0, window_size):
        char = datastream[i]
        counter[char] = counter[char] + 1
        pos = i
        if counter[char] == 1:
            total = total + 1

    for i in range(pos + 1, len(datastream)):
        # cleanup
        old_char = datastream[i - window_size]
        counter[old_char] = counter[old_char] - 1
        if counter[old_char] == 0:
            total = total - 1

        char = datastream[i]
        counter[char] = counter[char] + 1
        if counter[char] == 1:
            total = total + 1

        if total == window_size:
            return i + 1

    return -1


def main():
    filename = "input.txt"
    callable = find_marker_optimized if filename.endswith("bigboy.txt") else find_marker

    # filepath = __file__.replace("main.py", "bigboy.txt")
    filepath = __file__.replace("main.py", "input.txt")

    start = time.perf_counter()
    datastream = open(filepath, "r", encoding="utf-8").readlines()[0]
    print(
        f"Solution 1: {callable(datastream, 4)} (took: {time.perf_counter() - start})s"
    )

    start = time.perf_counter()
    datastream = open(filepath, "r", encoding="utf-8").readlines()[0]
    print(
        f"Solution 2: {callable(datastream, 14)} (took: {time.perf_counter() - start})s"
    )
    pass


if __name__ == "__main__":
    main()
