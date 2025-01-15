import random
import time
import matplotlib.pyplot as plt

def matrix_multiply(A, B, n):
    result = [[0 for _ in range(n)] for _ in range(n)]
    for i in range(n):
        for j in range(n):
            for k in range(n):
                result[i][j] += A[i][k] * B[k][j]
    return result

def generate_random_matrix(n):
    return [[random.randint(0, 10) for _ in range(n)] for _ in range(n)]

sizes = list(range(5, 205, 5))  # Range from 5 to 200 with step size 5
additions = []
multiplications = []
total_time = []

# Loop through each matrix size
for n in sizes:
    A = generate_random_matrix(n)
    B = generate_random_matrix(n)
    
    start_time = time.time()
    matrix_multiply(A, B, n)
    end_time = time.time()
    execution_time = (end_time - start_time) * 1000  # Convert to milliseconds

    num_multiplications = n**3  # n*n*n multiplications
    num_additions = n * 2 * (n-1)  # n*2*(n-1) additions

    additions.append(num_additions / 1e6)  # Convert to millions for better scaling
    multiplications.append(num_multiplications / 1e6)  # Convert to millions for better scaling
    total_time.append(execution_time / 1e3)  # Convert to seconds

# Plotting
plt.figure(figsize=(12, 7))
plt.plot(sizes, additions, label='Additions (in millions)', marker='o', color='cyan')
plt.plot(sizes, multiplications, label='Multiplications (in millions)', marker='o', color='magenta')
plt.plot(sizes, total_time, label='Execution Time (seconds)', marker='o', color='lime')

plt.xlabel('Matrix Size (n)')
plt.ylabel('Scaled Operations / Time')
plt.title('Matrix Multiplication: Additions, Multiplications, Execution Time')
plt.legend()
plt.grid(True)
plt.ylim(0, 8)  # Set the max value of y-axis to 8
plt.yticks([i * 0.5 for i in range(17)])  # Set y-axis scale to 0.5 per unit
plt.show()