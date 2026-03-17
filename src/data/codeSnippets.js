export const codeSnippets = [
  {
    id: 1,
    title: 'Pointer Arithmetic',
    code: `int arr[] = {10, 20, 30, 40, 50};
int *p = arr;
p = p + 2;
printf("%d\\n", *p);      // line 4
printf("%d\\n", *(p-1));  // line 5
printf("%d\\n", p[1]);    // line 6`,
    steps: [
      {
        line: 1,
        description: 'arr = {10,20,30,40,50} allocated on stack starting at 0x100',
        vars: { 'arr[0]': 10, 'arr[1]': 20, 'arr[2]': 30, 'arr[3]': 40, 'arr[4]': 50 },
      },
      {
        line: 2,
        description: 'p = arr = 0x100 → p points to arr[0] = 10',
        vars: { p: '0x100', '*p': 10 },
      },
      {
        line: 3,
        description: 'p = p + 2 = 0x108 (moved 2×4=8 bytes) → p now points to arr[2] = 30',
        vars: { p: '0x108', '*p': 30 },
      },
      {
        line: 4,
        description: '*p = arr[2] = 30 → prints 30',
        vars: { output: '30' },
      },
      {
        line: 5,
        description: '*(p-1) = arr[1] = 20 → prints 20',
        vars: { output: '20' },
      },
      {
        line: 6,
        description: 'p[1] = *(p+1) = arr[3] = 40 → prints 40',
        vars: { output: '40' },
      },
    ],
    output: '30\n20\n40',
  },
  {
    id: 2,
    title: 'Struct Memory Layout',
    code: `struct Point {
    int x;      // offset 0, 4 bytes
    char c;     // offset 4, 1 byte
    int y;      // offset 8, 4 bytes (padded!)
};
struct Point pt = {3, 'A', 7};
printf("size: %zu\\n", sizeof(struct Point)); // 12
printf("x=%d, c=%c, y=%d\\n", pt.x, pt.c, pt.y);`,
    steps: [
      {
        line: 1,
        description: 'struct Point defined: x(4B) + c(1B) + 3B padding + y(4B) = 12 bytes total',
        vars: { 'sizeof(Point)': 12, 'offset x': 0, 'offset c': 4, 'offset y': 8 },
      },
      {
        line: 6,
        description: 'pt initialized: x=3 at offset 0, c="A"(65) at offset 4',
        vars: { 'pt.x': 3, 'pt.c': "'A'" },
      },
      {
        line: 6,
        description: '3 bytes of padding inserted at offset 5-7 for int alignment',
        vars: { padding: '3 bytes at offset 5-7' },
      },
      {
        line: 6,
        description: 'pt.y=7 at offset 8 (aligned to 4-byte boundary)',
        vars: { 'pt.y': 7 },
      },
      {
        line: 7,
        description: 'sizeof(struct Point) = 12 → prints "size: 12"',
        vars: { output: 'size: 12' },
      },
      {
        line: 8,
        description: 'Access pt.x=3, pt.c="A", pt.y=7 → prints "x=3, c=A, y=7"',
        vars: { output: 'x=3, c=A, y=7' },
      },
    ],
    output: 'size: 12\nx=3, c=A, y=7',
  },
  {
    id: 3,
    title: 'malloc / free',
    code: `int *arr = (int*)malloc(5 * sizeof(int));
if (arr == NULL) return 1;
for (int i = 0; i < 5; i++) arr[i] = i * 10;
arr[2] = 99;
printf("%d %d %d\\n", arr[0], arr[2], arr[4]);
free(arr);
arr = NULL;`,
    steps: [
      {
        line: 1,
        description: 'malloc(20) allocates 20 bytes on heap → returns pointer, arr stores address',
        vars: { arr: '0xHEAP', 'block size': '20 bytes' },
      },
      {
        line: 2,
        description: 'NULL check passes — malloc succeeded',
        vars: { 'arr == NULL': false },
      },
      {
        line: 3,
        description: 'Loop i=0..4: arr = [0, 10, 20, 30, 40]',
        vars: { 'arr[0]': 0, 'arr[1]': 10, 'arr[2]': 20, 'arr[3]': 30, 'arr[4]': 40 },
      },
      {
        line: 4,
        description: 'arr[2] = 99 → arr = [0, 10, 99, 30, 40]',
        vars: { 'arr[2]': 99 },
      },
      {
        line: 5,
        description: 'arr[0]=0, arr[2]=99, arr[4]=40 → prints "0 99 40"',
        vars: { output: '0 99 40' },
      },
      {
        line: 6,
        description: 'free(arr) → block returned to heap allocator, memory available for reuse',
        vars: { heap: 'block freed' },
      },
      {
        line: 7,
        description: 'arr = NULL → prevents use-after-free / dangling pointer dereference',
        vars: { arr: 'NULL' },
      },
    ],
    output: '0 99 40',
  },
  {
    id: 4,
    title: 'Double Pointer',
    code: `int x = 5;
int *p = &x;
int **pp = &p;
**pp = 42;
printf("%d\\n", x);   // 42
*pp = NULL;
printf("%d\\n", p == NULL ? 0 : *p);  // 0`,
    steps: [
      {
        line: 1,
        description: 'x = 5 allocated on stack at address 0x200',
        vars: { x: 5, '&x': '0x200' },
      },
      {
        line: 2,
        description: 'p = &x = 0x200 → p points to x',
        vars: { p: '0x200', '*p': 5 },
      },
      {
        line: 3,
        description: 'pp = &p → pp points to the pointer p (pointer-to-pointer)',
        vars: { pp: '&p', '*pp': '0x200', '**pp': 5 },
      },
      {
        line: 4,
        description: '**pp = 42 → follow pp→p→x and write 42, so x=42',
        vars: { x: 42, '*p': 42, '**pp': 42 },
      },
      {
        line: 5,
        description: 'x = 42 → prints "42"',
        vars: { output: '42' },
      },
      {
        line: 6,
        description: '*pp = NULL → sets p = NULL (dereferencing pp gives p)',
        vars: { p: 'NULL' },
      },
      {
        line: 7,
        description: 'p == NULL → condition true → prints "0"',
        vars: { output: '0' },
      },
    ],
    output: '42\n0',
  },
  {
    id: 5,
    title: 'Linked List Traversal',
    code: `struct Node { int val; struct Node *next; };
struct Node *n1 = malloc(sizeof(struct Node));
struct Node *n2 = malloc(sizeof(struct Node));
n1->val = 1; n1->next = n2;
n2->val = 2; n2->next = NULL;
struct Node *curr = n1;
while (curr != NULL) {
    printf("%d ", curr->val);
    curr = curr->next;
}`,
    steps: [
      {
        line: 2,
        description: 'n1 allocated on heap: 16 bytes (int val + 4B pad + 8B next pointer)',
        vars: { n1: '0xA000', 'sizeof(Node)': 16 },
      },
      {
        line: 3,
        description: 'n2 allocated on heap: 16 bytes',
        vars: { n2: '0xA010' },
      },
      {
        line: 4,
        description: 'n1->val=1, n1->next=n2 → n1 links to n2',
        vars: { 'n1->val': 1, 'n1->next': '0xA010' },
      },
      {
        line: 5,
        description: 'n2->val=2, n2->next=NULL → n2 is the tail',
        vars: { 'n2->val': 2, 'n2->next': 'NULL' },
      },
      {
        line: 6,
        description: 'curr = n1 → begin traversal',
        vars: { curr: 'n1 (0xA000)' },
      },
      {
        line: 8,
        description: 'curr != NULL → print curr->val=1, then curr=n2',
        vars: { output: '1 ', curr: 'n2 (0xA010)' },
      },
      {
        line: 8,
        description: 'curr != NULL → print curr->val=2, then curr=NULL → loop ends. Output: "1 2"',
        vars: { output: '1 2 ', curr: 'NULL' },
      },
    ],
    output: '1 2 ',
  },
  {
    id: 6,
    title: 'Array of Pointers',
    code: `char *words[] = {"hello", "world", "CS354"};
for (int i = 0; i < 3; i++) {
    printf("%c\\n", words[i][0]);
}
printf("%s\\n", *(words + 1));`,
    steps: [
      {
        line: 1,
        description: 'words: array of 3 char* on stack, each pointing to string literal in .rodata',
        vars: { 'words[0]': '"hello"', 'words[1]': '"world"', 'words[2]': '"CS354"' },
      },
      {
        line: 3,
        description: 'i=0: words[0][0] = "hello"[0] = "h" → prints "h"',
        vars: { i: 0, output: 'h' },
      },
      {
        line: 3,
        description: 'i=1: words[1][0] = "world"[0] = "w" → prints "w"',
        vars: { i: 1, output: 'w' },
      },
      {
        line: 3,
        description: 'i=2: words[2][0] = "CS354"[0] = "C" → prints "C"',
        vars: { i: 2, output: 'C' },
      },
      {
        line: 5,
        description: '*(words+1) = words[1] = pointer to "world" → printf %s prints "world"',
        vars: { output: 'world' },
      },
    ],
    output: 'h\nw\nC\nworld',
  },
  {
    id: 7,
    title: 'Stack Frames',
    code: `int add(int a, int b) {
    int result = a + b;
    return result;
}
int main() {
    int x = 3, y = 4;
    int z = add(x, y);
    printf("%d\\n", z);
}`,
    steps: [
      {
        line: 5,
        description: 'main() begins: stack frame created. x=3, y=4 on main\'s stack',
        vars: { 'main: x': 3, 'main: y': 4 },
      },
      {
        line: 7,
        description: 'add(3, 4) called → new stack frame pushed: a=3, b=4 (copies of x, y)',
        vars: { 'add: a': 3, 'add: b': 4 },
      },
      {
        line: 2,
        description: 'result = a + b = 3 + 4 = 7',
        vars: { 'add: result': 7 },
      },
      {
        line: 3,
        description: 'return 7 → add\'s stack frame is popped from the call stack',
        vars: { 'return value': 7 },
      },
      {
        line: 7,
        description: 'z = 7 in main\'s frame. add\'s frame is gone.',
        vars: { 'main: z': 7 },
      },
      {
        line: 8,
        description: 'printf("%d\\n", z) → prints "7"',
        vars: { output: '7' },
      },
    ],
    output: '7',
  },
  {
    id: 8,
    title: '2D Array Pointer Arithmetic',
    code: `int matrix[2][3] = {{1,2,3},{4,5,6}};
int *p = &matrix[0][0];
printf("%d\\n", *(p + 4));    // ?
printf("%d\\n", matrix[1][1]); // ?
int (*row)[3] = matrix;
printf("%d\\n", row[1][2]);   // ?`,
    steps: [
      {
        line: 1,
        description: 'matrix stored row-major: [1,2,3,4,5,6] contiguous in memory at 0x300',
        vars: { 'flat layout': '[1,2,3,4,5,6]', 'base addr': '0x300' },
      },
      {
        line: 2,
        description: 'p = &matrix[0][0] = 0x300 → points to first element (value=1)',
        vars: { p: '0x300', '*p': 1 },
      },
      {
        line: 3,
        description: '*(p+4) = element at flat index 4 = matrix[1][1] = 5 → prints 5',
        vars: { '*(p+4)': 5, output: '5' },
      },
      {
        line: 4,
        description: 'matrix[1][1]: row 1 col 1 → flat index 1*3+1=4 → value 5 → prints 5',
        vars: { 'matrix[1][1]': 5, output: '5' },
      },
      {
        line: 5,
        description: 'row = matrix: pointer to array of 3 ints, row[i] steps by 3 ints (12 bytes)',
        vars: { row: '0x300', 'sizeof(*row)': '12 bytes' },
      },
      {
        line: 6,
        description: 'row[1][2] = matrix[1][2] = flat index 1*3+2=5 → value 6 → prints 6',
        vars: { 'row[1][2]': 6, output: '6' },
      },
    ],
    output: '5\n5\n6',
  },
];

export const fillInBlanks = [
  {
    id: 1,
    code: `int arr[5] = {1,2,3,4,5};
int *p = arr + 3;
printf("%d\\n", ___);  // prints 4`,
    blank: '___',
    prompt: 'What expression prints the value 4?',
    acceptedAnswers: ['*p', 'p[0]', 'arr[3]'],
    explanation:
      'p = arr+3 points to arr[3]=4. Dereferencing with *p (or equivalently p[0] or arr[3]) gives 4.',
  },
  {
    id: 2,
    code: `struct Node *n = malloc(___);  // allocate one node`,
    blank: '___',
    prompt: 'Fill in the correct argument to malloc:',
    acceptedAnswers: ['sizeof(struct Node)', 'sizeof(*n)'],
    explanation:
      'Always use sizeof() to allocate the correct amount for a struct — never hardcode sizes. sizeof(*n) also works since n is struct Node*.',
  },
  {
    id: 3,
    code: `int x = 10;
int *p = &x;
___ = 20;  // sets x to 20 via pointer`,
    blank: '___',
    prompt: 'What expression sets x to 20 through the pointer p?',
    acceptedAnswers: ['*p'],
    explanation:
      'Dereferencing p with *p gives access to the value at p\'s address (which is x). Assigning 20 to *p changes x to 20.',
  },
  {
    id: 4,
    code: `// Free a linked list
struct Node *curr = head;
while (curr != NULL) {
    struct Node *next = curr->next;
    free(___);
    curr = next;
}`,
    blank: '___',
    prompt: 'What should be passed to free()?',
    acceptedAnswers: ['curr'],
    explanation:
      'You must save curr->next BEFORE freeing curr, then advance. Freeing curr releases the memory — accessing curr->next after free() is undefined behavior.',
  },
];
