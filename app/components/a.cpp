#include <iostream>
#include <vector>
#include <chrono>
using namespace std;

void matrixMultiplication(vector<vector<int>> &A, vector<vector<int>> &B, vector<vector<int>> &C, int n) {
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            C[i][j] = 0;
            for (int k = 0; k < n; ++k) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
}

int main() {
    vector<int> sizes = {5, 10, 15, 20, 25, 30,35,40,45,50};
    cout << "n\tTime (ms)\n";

    for (int n : sizes) {
        vector<vector<int>> A(n, vector<int>(n, 1));
        vector<vector<int>> B(n, vector<int>(n, 1));
        vector<vector<int>> C(n, vector<int>(n, 0));

        auto start = chrono::high_resolution_clock::now();
        matrixMultiplication(A, B, C, n);
        auto end = chrono::high_resolution_clock::now();

        chrono::duration<double, milli> elapsed = end - start;
        cout << n << "\t" << elapsed.count() << "\n";
    }

    return 0;
}