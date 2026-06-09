#include <stdio.h>
#include <pthread.h>
#define THREADS 4
#define INCREMENTS 1000000
long long counter = 0;
pthread_mutex_t lock;

void* increment_counter(void* arg)
{
for(int i = 0; i < INCREMENTS; i++)
{
pthread_mutex_lock(&lock);
counter++;
pthread_mutex_unlock(&lock);
}
return NULL;
}
int main()
{
pthread_t tid[THREADS];
pthread_mutex_init(&lock, NULL);
for(int i = 0; i < THREADS; i++)
{
pthread_create(&tid[i], NULL, increment_counter, NULL);
}
for(int i = 0; i < THREADS; i++)
{
pthread_join(tid[i], NULL);
}
printf("Final Counter Value = %lld\n", counter);
pthread_mutex_destroy(&lock);
return 0;
}
