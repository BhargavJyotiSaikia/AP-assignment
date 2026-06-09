#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define REP_LINEAR  200000
#define REP_LOG     5000000
#define REP_QUAD    2000   

/* ---------------- LINEAR ---------------- */
void linearCase(int n) {
    int *arr = (int *)malloc(n * sizeof(int));
    volatile int sum = 0;

    for(int r = 0; r < REP_LINEAR; r++) {
        for(int i = 0; i < n; i++) {
            arr[i] = i;
            sum += arr[i];
        }
    }
    free(arr);
}

/* ---------------- LOGARITHMIC ---------------- */
int logarithmicCase(int n, int depth) {
    if(n <= 1)
        return depth;
    return logarithmicCase(n / 2, depth + 1);
}

/* ---------------- QUADRATIC ---------------- */
void quadraticCase(int n) {
    volatile long long count = 0;

    for(int r = 0; r < REP_QUAD; r++) {
        for(int i = 0; i < n; i++) {
            for(int j = 0; j < n; j++) {
                count++;
            }
        }
    }
}

int main() {
    int n;
    clock_t start, end;

    printf("Enter input size (n): ");
    scanf("%d", &n);

    printf("\n--- TIME AND SPACE ANALYSIS ---\n");

    /* ---------- LOGARITHMIC ---------- */
    start = clock();
    int depth = logarithmicCase(n, 1);
    end = clock();
    printf("\nLogarithmic Case:\n");
    printf("Time  : %f seconds\n",
           (double)(end - start) / CLOCKS_PER_SEC);
    printf("Space : O(log n) ≈ %d bytes\n",
           depth * (int)sizeof(int));

    /* ---------- LINEAR ---------- */
    start = clock();
    linearCase(n);
    end = clock();
    printf("\nLinear Case:\n");
    printf("Time  : %f seconds\n",
           (double)(end - start) / CLOCKS_PER_SEC);
    printf("Space : O(n) = %lu bytes\n",
           (unsigned long)n * sizeof(int));

    /* ---------- QUADRATIC ---------- */
    start = clock();
    quadraticCase(n);
    end = clock();
    printf("\nQuadratic Case:\n");
    printf("Time  : %f seconds\n",
           (double)(end - start) / CLOCKS_PER_SEC);
    printf("Space : O(1) (simulated, theoretical O(n^2))\n");

    return 0;
}
