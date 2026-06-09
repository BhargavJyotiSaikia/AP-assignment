#include <stdio.h>
#include <stdlib.h>
#include <string.h>
typedef struct {
char *data;
size_t length;
size_t capacity;
} StringBuffer;
StringBuffer* sb_init(size_t initial_capacity) {
StringBuffer *sb=(StringBuffer*)malloc(sizeof(StringBuffer));
if(sb==NULL){
printf("Memory allocation failed\n");
return NULL;
}
sb->data=(char*)malloc(initial_capacity);
if(sb->data==NULL){
free(sb);
return NULL;
}
sb->length=0;
sb->capacity=initial_capacity;
sb->data[0]='\0';
return sb;
}
void sb_append(StringBuffer *sb,const char *str){
size_t str_len=strlen(str);
size_t required=sb->length+str_len+1;
while(required>sb->capacity){
size_t new_capacity=sb->capacity*2;
char *temp=(char*)realloc(sb->data,new_capacity);
if(temp==NULL){
printf("Reallocation failed\n");
return;
}
sb->data=temp;
sb->capacity=new_capacity;
}
strcpy(sb->data+sb->length,str);
sb->length+=str_len;
}
void sb_free(StringBuffer *sb){
free(sb->data);
free(sb);
}
int main(){
StringBuffer *sb=sb_init(8);
sb_append(sb,"Hello");

sb_append(sb," World!");
sb_append(sb," Dynamic String Buffer in C");
printf("%s\n",sb->data);
sb_free(sb);
return 0;
}
