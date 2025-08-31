def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


def process_numbers(nums):
    # Change
    result = []
    for i, n in enumerate(nums):
        if n % 2 == 0:
            result.append(fibonacci(i))
        else:
            result.append(n * n)
    return result
