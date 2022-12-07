import time
import string


def find_marker(datastream: bytes, window_size: int) -> int:
    for i in range(len(datastream)):
        if len(set(datastream[i : (i + window_size)])) == window_size:
            return i + window_size

    return -1


def find_marker_optimized(datastream: bytes, window_size: int) -> int:
    offset = 97
    counter = [0] * 26

    pos = 0
    total = 0
    while pos < window_size:
        char = datastream[pos] - offset
        counter[char] = counter[char] + 1
        if counter[char] == 1:
            total = total + 1

        pos = pos + 1

    size = len(datastream)
    while pos < size:
        # cleanup
        old_char = datastream[pos - window_size] - offset
        counter[old_char] = counter[old_char] - 1
        if counter[old_char] == 0:
            total = total - 1

        char = datastream[pos] - offset
        counter[char] = counter[char] + 1
        if counter[char] == 1:
            total = total + 1

        if total == window_size:
            return pos + 1

        pos = pos + 1
    return -1


def main():
    filename = "input.txt"
    # filename = "bigboy.txt"
    callable = find_marker_optimized if filename.endswith("bigboy.txt") else find_marker

    filepath = __file__.replace("main.py", filename)

    start = time.perf_counter()
    datastream = open(filepath, "rb", buffering=0).read()
    print(
        f"Solution 1: {callable(datastream, 4)} (took: {time.perf_counter() - start})s"
    )

    start = time.perf_counter()
    datastream = open(filepath, "rb", buffering=0).read()
    print(
        f"Solution 2: {callable(datastream, 14)} (took: {time.perf_counter() - start})s"
    )
    pass


if __name__ == "__main__":
    main()
