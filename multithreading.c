#include <stdio.h>
#include <pthread.h>
#define THREADS 4
#define INCREMENTS 1000000
long long counter = 0;
void* increment_counter(void* arg)
{
for(int i = 0; i < INCREMENTS; i++)
{
counter++; // Critical section (unsafe)
}
return NULL;
}
int main()
{
pthread_t tid[THREADS];
for(int i = 0; i < THREADS; i++)
{
pthread_create(&tid[i], NULL, increment_counter, NULL);
}
for(int i = 0; i < THREADS; i++)
{
pthread_join(tid[i], NULL);
}
printf("Final Counter Value = %lld\n", counter);
return 0;
}
