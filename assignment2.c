#include <stdio.h>
#include <stdlib.h>

/* O(1) Space */
void constantSpace(int n) {
    int sum = 0;

    for(int i = 0; i < n; i++) {
        sum += i;
    }

    printf("Sum = %d\n", sum);
}

/* O(n) Space */
void linearSpace(int n) {
    int *arr = (int *)malloc(n * sizeof(int));

    for(int i = 0; i < n; i++) {
        arr[i] = i;
    }

    printf("Array created of size %d\n", n);

    free(arr);
}

/* O(n²) Space */
void quadraticSpace(int n) {
    int **matrix = (int **)malloc(n * sizeof(int *));

    for(int i = 0; i < n; i++) {
        matrix[i] = (int *)malloc(n * sizeof(int));
    }

    printf("Matrix created of size %d x %d\n", n, n);

    for(int i = 0; i < n; i++) {
        free(matrix[i]);
    }

    free(matrix);
}

int main() {
    int n;

    printf("Enter n: ");
    scanf("%d", &n);

    constantSpace(n);
    printf("Space Complexity: O(1)\n\n");

    linearSpace(n);
    printf("Space Complexity: O(n)\n\n");

    quadraticSpace(n);
    printf("Space Complexity: O(n^2)\n");

    return 0;
}

