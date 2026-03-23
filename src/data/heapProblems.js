export const heapProblems = [
  {
    id: 1,
    heapState: '[32/1][16/0][16/0][48/1][32/0]',
    question: 'After calling free() on the first block, how many total free blocks will exist after immediate coalescing?',
    options: ['1', '2', '3', '4'],
    answer: 1,
    explanation:
      'The first block (32) becomes free. It coalesces with the immediately following 16/0, and that merged block coalesces with the next 16/0, creating one 64-byte free block. The final 32/0 remains a separate free block. Total: 2 free blocks.',
  },
  {
    id: 2,
    heapState: '[16/1][32/0][64/1][16/0][16/0][32/1]',
    question:
      'What is the minimum malloc size that CANNOT be satisfied from the existing free space (assuming immediate coalescing)?',
    options: ['16 bytes', '32 bytes', '33 bytes', '48 bytes'],
    answer: 2,
    explanation:
      'The free blocks are 32 bytes and 32 bytes (16+16 coalesced). Neither can satisfy 33 bytes. The largest contiguous free block is 32 bytes after coalescing the two adjacent 16-byte free blocks.',
  },
  {
    id: 3,
    heapState: null,
    question: 'A block header has value 0x29. What is the block size and is it allocated?',
    options: ['Size=40, Free', 'Size=40, Allocated', 'Size=41, Allocated', 'Size=32, Free'],
    answer: 1,
    explanation:
      '0x29 = 41 decimal = 101001 binary. The LSB is 1 → allocated. Size = 0x29 & ~0x7 = 0x28 = 40 bytes.',
  },
  {
    id: 4,
    heapState: null,
    question: 'Which placement policy minimizes internal fragmentation?',
    options: ['First fit', 'Next fit', 'Best fit', 'Worst fit'],
    answer: 2,
    explanation:
      'Best fit searches for the smallest free block that can satisfy the request, minimizing leftover space inside the block (internal fragmentation). However it requires scanning all free blocks and can be slower.',
  },
  {
    id: 5,
    heapState: null,
    question:
      'If an allocator uses 8-byte alignment, what is the minimum block size for malloc(1)?',
    options: ['1 byte', '8 bytes', '16 bytes', '24 bytes'],
    answer: 2,
    explanation:
      'With 8-byte alignment and a required header (8 bytes) + footer (8 bytes) for coalescing, the minimum block is 8+1+7(padding)+8 = at minimum 16 bytes with header included. Most textbook implementations use 16 bytes as minimum block size.',
  },
  {
    id: 6,
    heapState: null,
    question: 'A block header encodes size=48, the previous block is free, and this block is free. What is the header value?',
    options: ['48', '49', '50', '51'],
    answer: 0,
    explanation:
      'Previous block is free → p-bit=0. This block is free → a-bit=0. Header = size | p-bit | a-bit = 48 | 0b00 | 0b0 = 48.',
  },
  {
    id: 7,
    heapState: '[24/1][32/0][24/1][16/0][16/0][24/1]',
    question: 'With first-fit placement, where does malloc(20) allocate from?',
    options: ['The 32-byte free block', 'The 16-byte free block', 'The second 16-byte free block', 'Fails — no space'],
    answer: 0,
    explanation:
      'First-fit scans from the beginning and takes the first block that fits. The 32-byte block is the first free block encountered, and 32 ≥ 20 (with overhead), so it is used.',
  },
  {
    id: 8,
    heapState: null,
    question: 'What does the p-bit (previous-allocated bit) in a block header indicate?',
    options: [
      'Whether this block has a footer',
      'Whether the previous block in memory is allocated',
      'Whether this block is a payload',
      'The number of previous free blocks',
    ],
    answer: 1,
    explanation:
      'The p-bit (bit 1) tracks whether the immediately preceding block in memory is allocated (p-bit=1) or free (p-bit=0). This allows the allocator to coalesce with the previous block without needing a footer on allocated blocks.',
  },
  {
    id: 9,
    heapState: null,
    question: 'Why do only free blocks need footers in a modern heap allocator?',
    options: [
      'Allocated blocks store their size in the payload',
      'The p-bit in the next block tells us the prev block size',
      'You need the footer to coalesce backward — only free blocks are coalesced',
      'Footers are optional for all blocks',
    ],
    answer: 2,
    explanation:
      'Footers are only needed to coalesce backward with a free previous block. If the previous block is allocated, no coalescing is needed, and the p-bit in the current block signals that. Only free blocks need footers for backward traversal during coalescing.',
  },
  {
    id: 10,
    heapState: null,
    question: 'A header has value 0x31. What is the block size and allocation status?',
    options: ['Size=48, Allocated', 'Size=48, Free', 'Size=49, Allocated', 'Size=32, Allocated'],
    answer: 0,
    explanation:
      '0x31 = 49 decimal = 0b110001. LSB (a-bit)=1 → allocated. Size = 0x31 & ~0x7 = 0x30 = 48 bytes.',
  },
  {
    id: 11,
    heapState: '[16/0][32/0][16/1][64/0]',
    question: 'How many total free bytes are available after coalescing?',
    options: ['16', '32', '48', '112'],
    answer: 3,
    explanation:
      'The 16/0 and 32/0 blocks are adjacent free blocks → they coalesce into one 48-byte free block. The 64/0 block is separated by the allocated 16/1 block so it stays separate. Total free bytes = 48 + 64 = 112.',
  },
  {
    id: 12,
    heapState: null,
    question: 'What is external fragmentation?',
    options: [
      'Wasted space inside an allocated block due to alignment',
      'Enough total free memory exists, but no single contiguous free block is large enough',
      'Memory that is lost when free() is not called',
      'Fragmentation caused by the OS page system',
    ],
    answer: 1,
    explanation:
      'External fragmentation occurs when the total free memory is sufficient for a request but no single contiguous free block is large enough. For example, two 16-byte free blocks separated by an allocated block cannot serve a malloc(32) request.',
  },
  {
    id: 13,
    heapState: null,
    question: 'What happens when you call free() on a pointer that was already freed?',
    options: [
      'The allocator handles it gracefully',
      'A double-free — causes undefined behavior and potential security vulnerability',
      'The block is marked free twice with no consequence',
      'A segfault always occurs immediately',
    ],
    answer: 1,
    explanation:
      'Double-free is undefined behavior. It can corrupt the allocator\'s free list, lead to arbitrary code execution (exploit primitive), or cause a crash. The allocator has no required protection against this in standard C.',
  },
  {
    id: 14,
    heapState: null,
    question: 'When is memory utilization maximized?',
    options: [
      'When throughput (malloc/free ops per second) is highest',
      'When the fraction of heap used for payloads is highest, minimizing overhead and fragmentation',
      'When the heap is completely full',
      'When all blocks have footers',
    ],
    answer: 1,
    explanation:
      'Memory utilization = (sum of payloads) / (total heap size). It is maximized by minimizing overhead (headers/footers) and fragmentation (both internal and external). There is a trade-off: better throughput often means less utilization.',
  },
  {
    id: 15,
    heapState: null,
    question: 'malloc(0) is called. What does a standard C allocator return?',
    options: [
      'NULL always',
      'A valid pointer to a zero-size block, or NULL — implementation defined',
      'A pointer to a 1-byte block',
      'Undefined behavior',
    ],
    answer: 1,
    explanation:
      'The C standard says malloc(0) may return NULL or a unique non-NULL pointer. Behavior is implementation-defined. Importantly, calling free() on the returned pointer (if non-NULL) is valid.',
  },
  {
    id: 16,
    heapState: '[8/1][64/0][8/1][8/0][8/1]',
    question: 'With best-fit policy, where does malloc(8) allocate?',
    options: ['The 64-byte block', 'The 8-byte free block', 'A new block at end of heap', 'Cannot be determined'],
    answer: 1,
    explanation:
      'Best-fit selects the smallest free block that fits the request. malloc(8) needs at least 8 bytes. The 8-byte free block is a perfect fit (smallest that works), so best-fit selects it over the 64-byte block.',
  },
  {
    id: 17,
    heapState: null,
    question: 'calloc(10, 4) is called. What does it return?',
    options: [
      'A pointer to 40 bytes of memory with garbage values',
      'A pointer to 40 bytes of zero-initialized memory',
      'A pointer to 10 blocks each of size 4, linked together',
      'NULL because calloc only works for single allocations',
    ],
    answer: 1,
    explanation:
      'calloc(n, size) allocates n * size = 40 bytes and zeroes out all bytes before returning the pointer. Use calloc when you need a zeroed buffer; it is equivalent to malloc + memset(ptr, 0, size) but often more efficient.',
  },
  {
    id: 18,
    heapState: null,
    question: 'How does an allocator find the header of the PREVIOUS block in O(1) time?',
    options: [
      'It scans backward from the current block header',
      'It reads the footer of the previous block (the word immediately before the current header)',
      'It looks up a separate linked list',
      'It maintains a separate array of block sizes',
    ],
    answer: 1,
    explanation:
      'The footer of a free block stores the block size (same as the header). The word immediately before the current block\'s header is the previous block\'s footer. From the footer value, you extract the size and subtract it to find the previous block\'s header. This is constant-time O(1) backward traversal.',
  },
  {
    id: 19,
    heapState: null,
    question: 'After malloc returns a pointer p, what is stored at address p - HEADER_SIZE?',
    options: [
      'The previous block\'s size',
      'The block header (size + allocation bits)',
      'A null pointer sentinel',
      'The allocator\'s free list head',
    ],
    answer: 1,
    explanation:
      'malloc returns a pointer to the payload — the usable memory region just after the header. At p - HEADER_SIZE sits the block header containing the block size and allocation status bits.',
  },
  {
    id: 20,
    heapState: '[32/1][32/0][64/1][32/0][32/1]',
    question: 'With next-fit policy and the rover starting after the first free block, where does malloc(24) allocate?',
    options: [
      'First 32-byte free block',
      'Second 32-byte free block (after the 64/1 block)',
      'A new block extended from end of heap',
      'The 64-byte allocated block is split',
    ],
    answer: 1,
    explanation:
      'Next-fit starts searching from where the last search ended (after the first free block). The rover picks up at the second 32-byte free block, which can satisfy malloc(24). Next-fit avoids restarting from the beginning.',
  },
  {
    id: 21,
    heapState: null,
    question: 'An explicit free list is more efficient than an implicit free list because:',
    options: [
      'It uses less memory per block',
      'malloc only traverses free blocks instead of all blocks',
      'It eliminates the need for headers',
      'It prevents external fragmentation',
    ],
    answer: 1,
    explanation:
      'An explicit free list maintains a doubly-linked list of only the free blocks. malloc traverses only free blocks (via pred/succ pointers) instead of scanning every block in the heap. This makes allocation proportional to the number of free blocks, not total blocks.',
  },
  {
    id: 22,
    heapState: null,
    question: 'realloc(ptr, new_size) is called where new_size < old_size. What is the most efficient behavior?',
    options: [
      'Always malloc new_size, copy, then free old block',
      'Shrink the block in place (split if worthwhile), return same pointer',
      'Return NULL and keep the original block',
      'Allocate a new block at beginning of heap',
    ],
    answer: 1,
    explanation:
      'When shrinking, a good allocator splits the current block in-place: keeps the first new_size bytes allocated and marks the remainder as a new free block. This avoids a copy and returns the same pointer. malloc+copy+free is always correct but wasteful.',
  },
  {
    id: 23,
    heapState: null,
    question: 'What is the difference between a dangling pointer and a memory leak?',
    options: [
      'Both are the same problem',
      'Dangling: using freed memory. Memory leak: forgetting to free allocated memory',
      'Dangling: stack overflow. Memory leak: heap overflow',
      'Dangling: NULL dereference. Memory leak: double free',
    ],
    answer: 1,
    explanation:
      'A dangling pointer is a pointer that still refers to memory that has been freed — dereferencing it is undefined behavior. A memory leak is when allocated heap memory is never freed, causing the program to consume more memory over time without releasing it.',
  },
  {
    id: 24,
    heapState: '[16/1][48/0][16/1][48/0][16/1]',
    question: 'Immediate coalescing is used. After freeing the first 16-byte block, what is the heap state?',
    options: [
      '[16/0][48/0][16/1][48/0][16/1]',
      '[64/0][16/1][48/0][16/1]',
      '[16/0][48/0][16/1][48/0][16/1] (no coalescing possible)',
      '[128/0][16/1]',
    ],
    answer: 1,
    explanation:
      'The freed 16-byte block is at the start of the heap. The previous block is the heap prologue (always allocated), so no backward coalescing. The next block (48/0) is free, so forward coalescing happens: 16 + 48 = 64. Result: [64/0][16/1][48/0][16/1].',
  },
  {
    id: 25,
    heapState: null,
    question: 'Two consecutive calls to malloc(16) are made. Are the two returned payloads guaranteed to be contiguous in memory?',
    options: [
      'Yes, always contiguous',
      'No — there is a block header (at minimum 4-8 bytes) between payloads',
      'Yes, if the allocator uses best-fit',
      'Only if calloc is used instead',
    ],
    answer: 1,
    explanation:
      'Between any two consecutive heap blocks there is always at least a header. The payload of the second block starts at: (start of first payload) + (first block size including header). So the payloads are NOT contiguous — the header of the second block sits between them.',
  },
  {
    id: 26,
    heapState: null,
    question:
      'A block has size=64, is allocated, and the previous block is also allocated. Using 3-bit encoding (bit 0=a-bit, bit 1=p-bit), what is the header value in hex?',
    options: ['0x40', '0x41', '0x42', '0x43'],
    answer: 3,
    explanation:
      'Size = 64 = 0x40. a-bit = 1 (allocated). p-bit = 1 (prev allocated) → bit 1 = 1 means +2. Header = 0x40 | 0x02 | 0x01 = 0x43 = 67 decimal.',
  },
  {
    id: 27,
    heapState: null,
    question:
      'Free blocks in order: [64][16][32][48]. Using best-fit, which block does malloc(30) choose?',
    options: ['64-byte block', '16-byte block', '32-byte block', '48-byte block'],
    answer: 2,
    explanation:
      'Best-fit selects the smallest free block that can satisfy the request. 16 < 30 (too small). 32 ≥ 30 (fits, remainder=2). 48 ≥ 30 (fits, remainder=18). 64 ≥ 30 (fits, remainder=34). The 32-byte block is the smallest fit.',
  },
  {
    id: 28,
    heapState: '[32/1][32/0][32/1]',
    question:
      'The third block (32/1) is freed. Its header has p-bit=0 (previous block is free). After coalescing, what is the heap?',
    options: ['[32/1][32/0][32/0]', '[32/1][64/0]', '[96/0]', '[32/1][32/0][32/0] — no coalescing'],
    answer: 1,
    explanation:
      'When the third block is freed, the allocator checks: p-bit=0 → previous block is free → coalesce backward by reading the previous block\'s footer to get its size (32). Merged block = 32 + 32 = 64. The first block (32/1) is allocated, so no further backward coalescing. Result: [32/1][64/0].',
  },
  {
    id: 29,
    heapState: null,
    question:
      'A block has size=80, is allocated, and the previous block is allocated. Using 3-bit encoding (bit 0=a-bit, bit 1=p-bit), what is the header value in hex?',
    options: ['0x50', '0x51', '0x52', '0x53'],
    answer: 3,
    explanation:
      'Size = 80 = 0x50. a-bit = 1 (allocated), p-bit = 1 (prev allocated, bit 1). Header = 0x50 | 0x02 | 0x01 = 0x53 = 83 decimal.',
  },
  {
    id: 30,
    heapState: '[32/0][16/1][16/0][8/1][32/0]',
    question:
      'The rover (for next-fit) is currently at the 16-byte free block. malloc(12) is called. Which block does next-fit select?',
    options: ['First 32-byte free block', 'The 16-byte free block', 'Second 32-byte free block', 'None — allocation fails'],
    answer: 1,
    explanation:
      'Next-fit starts searching from the rover position. The rover is at the 16-byte free block. 16 ≥ 12 → it fits. Next-fit selects this block without scanning further. First-fit would have chosen the first 32-byte block instead.',
  },
  {
    id: 31,
    heapState: null,
    question:
      'With an explicit free list, 4-byte headers, 4-byte footers, 4-byte pointers (next/prev), and 8-byte alignment, what is the minimum free block size?',
    options: ['8 bytes', '12 bytes', '16 bytes', '24 bytes'],
    answer: 2,
    explanation:
      'A free block needs: header (4B) + next pointer (4B) + prev pointer (4B) + footer (4B) = 16 bytes. This must also be a multiple of the alignment (8). 16 is already a multiple of 8. Minimum free block = 16 bytes.',
  },
  {
    id: 32,
    heapState: '[16/0][32/1][16/0]',
    question:
      'The middle block (32/1) is freed. Both neighbors are free. After immediate coalescing, what is the heap?',
    options: ['[16/0][32/0][16/0]', '[48/0][16/0]', '[16/0][48/0]', '[64/0]'],
    answer: 3,
    explanation:
      'When the 32-byte block is freed: next block (16/0) is free → forward coalesce: 32+16=48. Previous block (16/0) is free → backward coalesce: 16+48=64. All three merge into one 64-byte free block: [64/0].',
  },
  {
    id: 33,
    heapState: null,
    question:
      'A header value is 0x4B. What is the block size, allocation status, and previous block status? (bit 0=a-bit, bit 1=p-bit)',
    options: [
      'Size=72, free, prev free',
      'Size=72, allocated, prev allocated',
      'Size=75, allocated, prev free',
      'Size=72, allocated, prev free',
    ],
    answer: 1,
    explanation:
      '0x4B = 75 decimal = 0b01001011. a-bit (bit 0) = 1 → allocated. p-bit (bit 1) = 1 → previous block is allocated. Size = 0x4B & ~0x7 = 0x48 = 72 bytes.',
  },
  {
    id: 34,
    heapState: null,
    question:
      'An allocator considers splitting a 64-byte free block for a malloc(48) request. The minimum block size is 16 bytes. Should it split?',
    options: [
      'Yes — remainder is 16 bytes, which meets the minimum',
      'No — remainder of 16 bytes is too small',
      'Yes — always split regardless of remainder',
      'No — 48 does not fit in 64 bytes with overhead',
    ],
    answer: 0,
    explanation:
      'After allocating 48 bytes from the 64-byte block, the remainder is 64 - 48 = 16 bytes. Since 16 ≥ minimum block size (16), the allocator should split: allocate the first 48 bytes and create a new 16-byte free block from the remainder.',
  },
  {
    id: 35,
    heapState: '[32/1][24/0][16/1][24/0][8/1]',
    question:
      'Total free space is 48 bytes. What is the largest single allocation that can succeed?',
    options: ['32 bytes', '24 bytes', '48 bytes', '16 bytes'],
    answer: 1,
    explanation:
      'The two free blocks are 24 bytes and 24 bytes, separated by the allocated 16/1 block. They cannot be coalesced. The largest contiguous free block is 24 bytes. malloc(25) or larger would fail despite 48 total free bytes — this is external fragmentation.',
  },
]
