import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

np.random.seed(42)
data = np.random.randint(10, 100, 50)

def statistical_properties(data):
    print("Data:", data)
    print("Mean:", np.mean(data))
    print("Median:", np.median(data))
    mode_result = stats.mode(data, keepdims=True) 
    print("Mode:", mode_result.mode[0], "(Frequency:", mode_result.count[0], ")")
    print("Standard Deviation:", np.std(data))
    print("Variance:", np.var(data))
    print("25th Percentile:", np.percentile(data, 25))
    print("50th Percentile (Median):", np.percentile(data, 50))
    print("75th Percentile:", np.percentile(data, 75))


def plot_histogram(data):
    plt.hist(data, bins=10, color='blue', edgecolor='black')
    plt.title('Histogram')
    plt.xlabel('Data Values')
    plt.ylabel('Frequency')
    plt.show()

def big_data_distribution():
    big_data = np.random.normal(loc=50, scale=15, size=10000)
    plt.hist(big_data, bins=50, color='green', alpha=0.7)
    plt.title('Big Data Distribution')
    plt.xlabel('Values')
    plt.ylabel('Frequency')
    plt.show()

def normal_data_distribution():
    normal_data = np.random.normal(0, 1, 1000)
    plt.hist(normal_data, bins=30, color='orange', alpha=0.7)
    plt.title('Normal Data Distribution')
    plt.xlabel('Values')
    plt.ylabel('Frequency')
    plt.show()

def scatter_plot():
    x = np.random.rand(50)
    y = 2 * x + np.random.normal(0, 0.1, 50)
    plt.scatter(x, y, color='purple')
    plt.title('Scatter Plot')
    plt.xlabel('X-axis')
    plt.ylabel('Y-axis')
    plt.show()

def random_data_distributions():
    uniform_data = np.random.uniform(0, 10, 1000)
    plt.hist(uniform_data, bins=30, color='red', alpha=0.7)
    plt.title('Uniform Data Distribution')
    plt.xlabel('Values')
    plt.ylabel('Frequency')
    plt.show()

if __name__ == "__main__":
    statistical_properties(data)
    plot_histogram(data)
    big_data_distribution()
    normal_data_distribution()
    scatter_plot()
    random_data_distributions()
