export const examQuestions = [
  // HEAP questions
  {
    id: 'H1',
    topic: 'heap',
    points: 2,
    question: 'A block header value is 0x31. What is the block size?',
    options: ['48', '49', '50', '32'],
    answer: 0,
    explanation:
      '0x31 = 49 decimal. The LSB (bit 0) is the allocated bit. Size = 0x31 & ~0x7 = 0x30 = 48 bytes.',
  },
  {
    id: 'H2',
    topic: 'heap',
    points: 2,
    question: 'Which allocator policy is most likely to reduce external fragmentation over time?',
    options: ['First fit', 'Next fit', 'Best fit', 'Worst fit'],
    answer: 2,
    explanation:
      'Best fit finds the smallest suitable free block, leaving smaller leftover fragments rather than splitting large blocks. Over time this preserves larger contiguous free regions.',
  },
  {
    id: 'H3',
    topic: 'heap',
    points: 2,
    question: 'What does the LSB of a block header encode?',
    options: ['Block size', 'Allocated/free bit', 'Pointer to next block', 'Payload size'],
    answer: 1,
    explanation:
      'Block sizes are always multiples of the alignment (e.g. 8 bytes), so the lower 3 bits of the size are always 0. The allocator steals the LSB to store whether the block is allocated (1) or free (0).',
  },
  {
    id: 'H4',
    topic: 'heap',
    points: 2,
    question: 'Why does an allocator need a footer (boundary tag)?',
    options: [
      'To store payload',
      'For alignment',
      'To coalesce with previous free block',
      'To prevent overflow',
    ],
    answer: 2,
    explanation:
      'When freeing a block, the allocator needs to check if the PREVIOUS block is free to coalesce backwards. A footer (duplicate of the header) at the end of each block lets the allocator read the previous block\'s size/status by looking backwards.',
  },
  {
    id: 'H5',
    topic: 'heap',
    points: 3,
    question:
      'Heap: [16/1][32/0][16/0][32/1][16/0]. After free(block0), how many free blocks after coalescing?',
    options: ['2', '3', '4', '1'],
    answer: 0,
    explanation:
      'Block0 (16/1) becomes free → 16/0. It coalesces with adjacent 32/0 and 16/0 → one 64-byte free block. The last 16/0 is not adjacent (separated by 32/1) → remains separate. Total: 2 free blocks.',
  },
  {
    id: 'H6',
    topic: 'heap',
    points: 3,
    question:
      'malloc(40) is called on a heap with free blocks of sizes [16][32][48][24]. Using first-fit, which block is chosen?',
    options: ['16', '32', '48', '24'],
    answer: 2,
    explanation:
      'First-fit scans from the beginning: 16 < 40 (skip), 32 < 40 (skip), 48 ≥ 40 (choose!). The 48-byte block is selected and split — 40 bytes allocated, 8 bytes remain free (if ≥ min block size).',
  },
  {
    id: 'H7',
    topic: 'heap',
    points: 3,
    question:
      'A heap has 100 bytes of free space in 10 separate 10-byte blocks. malloc(15) returns NULL. This is an example of:',
    options: [
      'Internal fragmentation',
      'External fragmentation',
      'Memory leak',
      'Buffer overflow',
    ],
    answer: 1,
    explanation:
      'External fragmentation: there is enough total free memory (100 bytes) but no single contiguous free block large enough to satisfy malloc(15). The free memory is fragmented into pieces too small to be useful.',
  },
  {
    id: 'H8',
    topic: 'heap',
    points: 2,
    question: 'Which of the following prevents a dangling pointer after free()?',
    options: [
      'Calling malloc() again',
      'Setting the pointer to NULL',
      'Using free() twice',
      'Adding a footer',
    ],
    answer: 1,
    explanation:
      'After free(ptr), setting ptr = NULL ensures any accidental dereference will cause a clean null-pointer fault rather than silent undefined behavior. Double-free (option C) is itself a serious bug.',
  },
  // CACHE questions
  {
    id: 'C1',
    topic: 'cache',
    points: 2,
    question: 'Cache: S=8, E=1, B=16, m=16. How many offset bits?',
    options: ['3', '4', '8', '16'],
    answer: 1,
    explanation: 'b = log2(B) = log2(16) = 4 offset bits.',
  },
  {
    id: 'C2',
    topic: 'cache',
    points: 2,
    question:
      'Cache: S=4, E=1, B=4, m=8. Address 0x14 = 00010100. What is the set index?',
    options: ['0', '1', '5', '2'],
    answer: 1,
    explanation:
      'b=log2(4)=2, s=log2(4)=2, t=4. 0x14=00010100. Rightmost 2 bits=00 (offset). Next 2 bits=01=1 (set index). Tag=0001.',
  },
  {
    id: 'C3',
    topic: 'cache',
    points: 2,
    question:
      'What type of miss occurs when a program accesses a block it previously had but was evicted due to limited cache size?',
    options: ['Cold miss', 'Conflict miss', 'Capacity miss', 'Compulsory miss'],
    answer: 2,
    explanation:
      'A capacity miss occurs when the working set is larger than the cache — blocks get evicted and then re-accessed. Cold (compulsory) misses are first-ever accesses. Conflict misses arise from set contention.',
  },
  {
    id: 'C4',
    topic: 'cache',
    points: 2,
    question:
      'Direct-mapped cache: S=4, E=1, B=4, m=8. Addresses 0x00 and 0x10 will:',
    options: [
      'Always hit',
      'Map to different sets',
      'Map to same set (conflict)',
      'Cause cold misses only',
    ],
    answer: 2,
    explanation:
      'b=2, s=2. 0x00=00000000: offset=00, set=00=0. 0x10=00010000: offset=00, set=00=0, tag=0001. Both map to set 0 → conflict! In a direct-mapped cache, one evicts the other.',
  },
  {
    id: 'C5',
    topic: 'cache',
    points: 3,
    question:
      'Cache: S=2, E=2, B=8, m=8. b=3, s=1. Access sequence: 0x00, 0x40, 0x80, 0x00. How many total misses?',
    options: ['2', '3', '4', '1'],
    answer: 2,
    explanation:
      'b=3, s=1, t=4. 0x00→set0,tag=0: MISS(cold). 0x40=01000000→set0,tag=0100: MISS(cold, E=2 so both fit). 0x80=10000000→set0,tag=1000: MISS, evict LRU(0x00). 0x00→set0,tag=0: MISS(evicted). Total: 4 misses.',
  },
  {
    id: 'C6',
    topic: 'cache',
    points: 3,
    question: 'Total cache data size formula is:',
    options: ['S × E', 'S × E × B', 'S × B', '2^m'],
    answer: 1,
    explanation:
      'Total cache size = S sets × E lines/set × B bytes/line = S×E×B. This counts only data bytes, not the overhead from valid bits and tag bits.',
  },
  {
    id: 'C7',
    topic: 'cache',
    points: 2,
    question: 'Increasing block size B tends to:',
    options: [
      'Reduce spatial locality benefits',
      'Increase miss penalty on miss',
      'Improve spatial locality exploitation',
      'Decrease cache capacity',
    ],
    answer: 2,
    explanation:
      'Larger blocks exploit spatial locality by prefetching more nearby data on each miss. However, large blocks also increase the miss penalty (more bytes to fetch) and can cause pollution if data is not reused.',
  },
  {
    id: 'C8',
    topic: 'cache',
    points: 3,
    question: 'Cache: S=4, E=1, B=4, m=8. How many tag bits?',
    options: ['2', '4', '6', '8'],
    answer: 1,
    explanation: 'b=log2(4)=2, s=log2(4)=2, t=m-s-b=8-2-2=4 tag bits.',
  },
  // CODE TRACING questions
  {
    id: 'T1',
    topic: 'code',
    points: 2,
    question: 'int arr[]={1,2,3}; int *p=arr+1; printf("%d", *p+1); prints:',
    options: ['2', '3', '4', '1'],
    answer: 1,
    explanation:
      'p = arr+1 points to arr[1]=2. *p+1 = *(p)+1 = 2+1 = 3. Note: *p+1 is NOT *(p+1). Operator precedence: * dereferences first, then + adds 1.',
  },
  {
    id: 'T2',
    topic: 'code',
    points: 2,
    question: 'sizeof(struct { int a; char b; int c; }) =',
    options: ['9', '12', '8', '16'],
    answer: 1,
    explanation:
      'int a (4B) + char b (1B) + 3B padding (to align c to 4B boundary) + int c (4B) = 12 bytes. The compiler inserts 3 bytes of padding between b and c for alignment.',
  },
  {
    id: 'T3',
    topic: 'code',
    points: 3,
    question: 'int x=5; int *p=&x; int **pp=&p; **pp=10; printf("%d",x) prints:',
    options: ['5', '10', 'Address of x', 'Undefined behavior'],
    answer: 1,
    explanation:
      '**pp = 10: dereference pp to get p (which points to x), then dereference p to get x, then assign 10. So x becomes 10.',
  },
  {
    id: 'T4',
    topic: 'code',
    points: 2,
    question: 'int a=2,b=3; int *p=&a; *p=*p+b; printf("%d %d",a,b) prints:',
    options: ['2 3', '5 3', '2 5', '5 5'],
    answer: 1,
    explanation:
      '*p = *p + b → *p = 2 + 3 = 5. Since p points to a, this sets a=5. b is unchanged. Output: "5 3".',
  },
  {
    id: 'T5',
    topic: 'code',
    points: 3,
    question: 'char *s = "hello"; printf("%c", *(s+3)); prints:',
    options: ["'h'", "'e'", "'l'", "'o'"],
    answer: 2,
    explanation:
      '"hello" indices: h=0, e=1, l=2, l=3, o=4. *(s+3) = s[3] = \'l\' (the second l). Output: \'l\'.',
  },
  {
    id: 'T6',
    topic: 'code',
    points: 3,
    question:
      'int matrix[2][3]={{1,2,3},{4,5,6}}; int *p=&matrix[0][0]; printf("%d",*(p+5)) prints:',
    options: ['5', '6', '3', '4'],
    answer: 1,
    explanation:
      'matrix stored row-major: flat array [1,2,3,4,5,6]. p points to index 0 (value=1). *(p+5) = element at flat index 5 = 6.',
  },
];
