export const cacheProblems = [
  {
    id: 1,
    params: 'S=4, E=1, B=4, m=8',
    question:
      'Cache: S=4, E=1, B=4, m=8. Access sequence: 0x00, 0x01, 0x08, 0x00. How many misses?',
    options: ['1', '2', '3', '4'],
    answer: 1,
    explanation:
      'b=log₂(4)=2, s=log₂(4)=2, t=4. 0x00=00|00|00→set0,tag0→MISS(cold). 0x01=00|00|01→set0,tag0→HIT(same block). 0x08=00|10|00→set2,tag0→MISS(cold). 0x00=00|00|00→set0,tag0→HIT(still cached). Total: 2 misses.',
  },
  {
    id: 2,
    params: 'S=4, E=2, B=8, m=12',
    question:
      'Cache: S=4, E=2, B=8, m=12. b=3, s=2, t=7. Address 0x3A8 on cold cache — hit or miss?',
    options: ['Hit', 'Miss', 'Depends on LRU', 'Cannot determine'],
    answer: 1,
    explanation:
      '0x3A8 = 0011 1010 1000. b=3: offset=000. s=2: index=01=set1. t=7: tag=0011101=29. Cold cache → no valid lines → MISS.',
  },
  {
    id: 3,
    params: 'S=8, E=4, B=32',
    question: 'What is the total size of a cache with S=8, E=4, B=32?',
    options: ['512 bytes', '1024 bytes', '2048 bytes', '256 bytes'],
    answer: 1,
    explanation: 'Total cache size = S × E × B = 8 × 4 × 32 = 1024 bytes = 1KB.',
  },
  {
    id: 4,
    params: 'm=16, S=16, E=1, B=8',
    question:
      'Cache: m=16, S=16, E=1, B=8. For address 0x1234: b=3, s=4, t=9. What set is accessed?',
    options: ['Set 4', 'Set 6', 'Set 2', 'Set 1'],
    answer: 1,
    explanation:
      '0x1234 = 0001 0010 0011 0100. b=3 → offset=100 (bits 0-2). s=4 → index bits 3-6 = 0110=6. Tag=remaining upper bits. Set 6 is accessed.',
  },
  {
    id: 5,
    params: 'conflict miss scenario',
    question: 'Which scenario causes a conflict miss?',
    options: [
      'First access to a block',
      'Two blocks map to same set in direct-mapped cache',
      'Cache is completely full',
      'Block size is too small',
    ],
    answer: 1,
    explanation:
      'A conflict miss occurs when two or more memory blocks compete for the same cache set (in a direct-mapped or set-associative cache), even if other sets are empty. This is distinct from cold misses (first access) and capacity misses (cache full).',
  },
  {
    id: 6,
    params: 'S=2, E=1, B=8, m=8',
    question:
      'Cache: S=2, E=1, B=8, m=8. b=3, s=1, t=4. Access 0x10, then 0x90. After both accesses, how many misses occurred?',
    options: ['0', '1', '2', '3'],
    answer: 2,
    explanation:
      '0x10=00010000: offset=000, index=0, tag=0001. Cold miss → load into set 0. 0x90=10010000: offset=000, index=0, tag=1001. Tag mismatch in set 0 → conflict miss (evicts 0x10 block). Total: 2 misses.',
  },
  {
    id: 7,
    params: 'B=64, word=4 bytes, stride=8 words',
    question:
      'Stride-miss formula: word_size=4, stride k=8 words, block B=64 bytes. What is the miss rate?',
    options: ['25%', '50%', '100%', '12.5%'],
    answer: 1,
    explanation:
      '% misses = min(1, (word_size × k) / B) × 100 = min(1, (4 × 8) / 64) × 100 = min(1, 32/64) × 100 = 0.5 × 100 = 50%.',
  },
  {
    id: 8,
    params: 'Write policies',
    question: 'Which combination of write policies is most commonly paired together?',
    options: [
      'Write-back + No-write-allocate',
      'Write-through + Write-allocate',
      'Write-back + Write-allocate',
      'Write-through + No-write-allocate',
    ],
    answer: 2,
    explanation:
      'Write-back is paired with write-allocate because: on a write miss, you load the block into cache (write-allocate), then write to cache only (write-back). When the block is evicted later, the dirty block is written to memory. Write-through is paired with no-write-allocate for similar consistency reasons.',
  },
  {
    id: 9,
    params: 'm=32, S=64, E=4, B=32',
    question: 'Cache: m=32, S=64, E=4, B=32. How many bits are used for the set index?',
    options: ['4', '5', '6', '7'],
    answer: 2,
    explanation:
      's = log₂(S) = log₂(64) = 6 bits for the set index.',
  },
  {
    id: 10,
    params: 'S=4, E=1, B=4, m=8',
    question:
      'Direct-mapped cache S=4, E=1, B=4, m=8. Addresses 0x00 and 0x10 both map to the same set. Accessing them alternately: 0x00, 0x10, 0x00, 0x10. How many misses?',
    options: ['1', '2', '3', '4'],
    answer: 3,
    explanation:
      '0x00=00000000: index=00, tag=00 → cold miss. 0x10=00010000: index=00, tag=01 → conflict miss (evicts 0x00). 0x00: index=00, tag=00 → conflict miss (evicts 0x10). 0x10: index=00, tag=01 → conflict miss (evicts 0x00). Total: 4 misses — this is a classic conflict miss thrashing scenario.',
  },
  {
    id: 11,
    params: 'Cache size formula',
    question: 'A cache has b=6, s=5, E=8. What is the total cache size in bytes?',
    options: ['1 KB', '16 KB', '256 KB', '8 KB'],
    answer: 1,
    explanation:
      'B = 2^b = 2^6 = 64 bytes. S = 2^s = 2^5 = 32 sets. Cache size = S × E × B = 32 × 8 × 64 = 16,384 bytes = 16 KB.',
  },
  {
    id: 12,
    params: 'LRU vs LFU',
    question: 'In LFU (Least Frequently Used) eviction, when two lines have the same access count, which is evicted?',
    options: [
      'The one with the smaller tag',
      'The one used least recently (falls back to LRU)',
      'A randomly chosen one',
      'The one loaded most recently',
    ],
    answer: 1,
    explanation:
      'LFU evicts the line with the fewest accesses. On a tie (equal frequency counts), LFU falls back to LRU — it evicts the one that was used least recently among the tied lines.',
  },
  {
    id: 13,
    params: 'm=12, B=8, S=8, E=2',
    question: 'Cache: m=12, B=8, S=8, E=2. How many tag bits are in each address?',
    options: ['4', '5', '6', '7'],
    answer: 2,
    explanation:
      'b = log₂(B) = log₂(8) = 3. s = log₂(S) = log₂(8) = 3. t = m - s - b = 12 - 3 - 3 = 6 tag bits.',
  },
  {
    id: 14,
    params: 'Spatial vs Temporal locality',
    question: 'Accessing elements of an array sequentially (index 0, 1, 2, 3...) exhibits which type of locality?',
    options: [
      'Temporal locality only',
      'Spatial locality only',
      'Both temporal and spatial locality',
      'Neither — arrays have poor locality',
    ],
    answer: 2,
    explanation:
      'Sequential array access exhibits spatial locality (nearby elements accessed in sequence, fitting in the same cache block). The loop counter and recently accessed elements also show temporal locality. Sequential array traversal is the gold standard for good cache behavior.',
  },
  {
    id: 15,
    params: 'S=4, E=2, B=4, m=8',
    question:
      'Cache: S=4, E=2, B=4, m=8. b=2, s=2, t=4. On a cold cache, how many misses occur for the access sequence: 0x00, 0x04, 0x08, 0x0C?',
    options: ['1', '2', '3', '4'],
    answer: 3,
    explanation:
      'b=2, s=2, t=4. 0x00=00000000: offset=00, set=00, tag=0000 → MISS (set0, line0). 0x04=00000100: offset=00, set=01, tag=0000 → MISS (set1, line0). 0x08=00001000: offset=00, set=10, tag=0000 → MISS (set2, line0). 0x0C=00001100: offset=00, set=11, tag=0000 → MISS (set3, line0). Total: 4 misses. All cold misses, each maps to a different set.',
  },
  {
    id: 16,
    params: 'miss types',
    question: 'Which type of miss is unavoidable regardless of cache design?',
    options: ['Conflict miss', 'Capacity miss', 'Cold miss', 'Compulsory miss'],
    answer: 2,
    explanation:
      'Cold misses (also called compulsory misses) occur on the very first access to any memory block. They are unavoidable because the block must be loaded into cache the first time it is accessed. Neither larger caches nor higher associativity eliminates cold misses.',
  },
  {
    id: 17,
    params: 'Write-through vs Write-back',
    question: 'Which write policy always keeps lower-level memory (RAM) up to date with every cache write?',
    options: ['Write-back', 'Write-allocate', 'Write-through', 'No-write-allocate'],
    answer: 2,
    explanation:
      'Write-through writes to both the cache and the lower-level memory on every write operation. This keeps lower memory always consistent with cache but generates more memory traffic. Write-back only updates lower memory when a dirty cache line is evicted.',
  },
  {
    id: 18,
    params: 'Intel i7 cache',
    question: 'The Intel i7\'s L1 data cache is 32KB, 8-way set associative, with 64-byte blocks. How many sets does it have?',
    options: ['32', '64', '128', '256'],
    answer: 1,
    explanation:
      'S = Cache size / (E × B) = 32768 / (8 × 64) = 32768 / 512 = 64 sets. Alternatively: b=log₂(64)=6, total cache bits = 32KB. S × 8 × 64 = 32768 → S = 64.',
  },
  {
    id: 19,
    params: 'Column-major vs row-major',
    question: 'In C, a 2D array int A[4][4] is stored in row-major order. Which access pattern has a higher cache miss rate?',
    options: [
      'Accessing A[0][0], A[0][1], A[0][2], A[0][3] (row-by-row)',
      'Accessing A[0][0], A[1][0], A[2][0], A[3][0] (column-by-column)',
      'Both have equal miss rates',
      'Row-major is worse because rows are longer',
    ],
    answer: 1,
    explanation:
      'Column-by-column access skips over entire rows (stride = 4 ints = 16 bytes). Since C stores arrays in row-major order, column access results in a high stride that spans multiple cache blocks, causing a miss on nearly every access. Row-by-row is optimal.',
  },
  {
    id: 20,
    params: 'Effect of larger block size',
    question: 'What is the PRIMARY downside of increasing block size B in a cache?',
    options: [
      'Fewer sets, reducing associativity',
      'Increased miss penalty (more bytes to transfer on miss) and potential pollution',
      'Tags become shorter and cause more conflicts',
      'The cache can no longer use LRU replacement',
    ],
    answer: 1,
    explanation:
      'Larger B means more bytes must be transferred on each miss, increasing miss penalty. It also risks cache pollution — loading many bytes that may never be used. However, larger B exploits spatial locality better when access patterns are sequential.',
  },
  {
    id: 21,
    params: 'Direct-mapped vs Fully Associative',
    question: 'A fully associative cache eliminates which type of miss compared to a direct-mapped cache?',
    options: ['Cold misses', 'Capacity misses', 'Conflict misses', 'All types of misses'],
    answer: 2,
    explanation:
      'A fully associative cache has one set containing all lines. Any block can map to any line, so there is no competition for a specific set. This eliminates conflict misses. Cold and capacity misses still occur.',
  },
  {
    id: 22,
    params: 'S=1, E=4, B=8, m=10',
    question:
      'Cache: S=1, E=4, B=8, m=10. b=3, s=0, t=7. What type of cache is this?',
    options: ['Direct-mapped', 'Set-associative (4-way)', 'Fully associative', '2-way set associative'],
    answer: 2,
    explanation:
      'S=1 means there is only one set containing all E=4 lines. Any memory block can map to any of the 4 lines. This is a fully associative cache (by definition: 1 set with multiple lines = fully associative).',
  },
  {
    id: 23,
    params: 'stride miss rate',
    question: 'Stride-1 access on 4-byte words with B=32 bytes. What is the miss rate?',
    options: ['100%', '50%', '25%', '12.5%'],
    answer: 3,
    explanation:
      '% misses = min(1, (4 × 1) / 32) × 100 = (4/32) × 100 = 12.5%. At stride-1, every 8th word causes a miss (since B/word_size = 32/4 = 8 words per block). Excellent spatial locality.',
  },
  {
    id: 24,
    params: 'Cache hit time',
    question: 'Why do larger caches (more sets or higher associativity) have longer hit times?',
    options: [
      'They require more power, slowing the transistors',
      'Checking more lines/sets takes more time; larger SRAM has higher access latency',
      'More sets means more set index bits, which takes longer to decode',
      'Cache must flush more data on eviction',
    ],
    answer: 1,
    explanation:
      'Larger caches have more lines to check (higher associativity) and more SRAM cells, both of which increase electrical access latency. Direct-mapped (E=1) has the fastest hit time but most conflict misses. Set-associative caches trade hit time for fewer conflict misses.',
  },
  {
    id: 25,
    params: 'm=8, S=4, E=1, B=4',
    question:
      'Cache: m=8, S=4, E=1, B=4. Addresses 0x00, 0x10, 0x20 — do they all map to the same set?',
    options: [
      'Yes, they all map to set 0',
      'No, each maps to a different set',
      '0x00 and 0x10 share a set, 0x20 is different',
      'Cannot determine without tag values',
    ],
    answer: 0,
    explanation:
      'b=log₂(4)=2, s=log₂(4)=2. Extract set bits (bits 2-3). 0x00=00000000: set=00=0. 0x10=00010000: set=00=0. 0x20=00100000: set=00=0. All three addresses map to set 0 — they differ only in tag bits. This causes conflict misses in a direct-mapped cache.',
  },
  {
    id: 26,
    params: 'Write-through traffic',
    question:
      'A write-through cache handles 100 store instructions, all hitting in cache. How many writes go to main memory?',
    options: ['0', '100', '1', 'Depends on dirty bits'],
    answer: 1,
    explanation:
      'Write-through sends every write to main memory in addition to updating the cache. 100 stores → 100 memory writes, regardless of hits. This is the main disadvantage of write-through: high memory traffic.',
  },
  {
    id: 27,
    params: 'Write-allocate vs no-write-allocate',
    question:
      'On a write miss, a write-allocate cache does what before writing?',
    options: [
      'Writes directly to main memory only',
      'Loads the block from memory into cache, then writes to cache',
      'Discards the write and retries',
      'Writes to a special write buffer',
    ],
    answer: 1,
    explanation:
      'Write-allocate loads the missed block into cache first (just like a read miss), then performs the write to the cached copy. This is typically paired with write-back so future writes to the same block only update the cache.',
  },
  {
    id: 28,
    params: 'S=1, E=3, B=4, m=8 (fully associative, LRU)',
    question:
      'Fully associative cache: S=1, E=3, B=4, m=8 with LRU. Access sequence: 0x00, 0x04, 0x08, 0x0C, 0x00. How many misses?',
    options: ['3', '4', '5', '2'],
    answer: 2,
    explanation:
      'b=2, s=0, t=6. All addresses map to the single set. 0x00(tag=000000): MISS, cache=[00]. 0x04(tag=000001): MISS, cache=[00,01]. 0x08(tag=000010): MISS, cache=[00,01,10] full. 0x0C(tag=000011): MISS, evict LRU(tag=00) → cache=[01,10,11]. 0x00(tag=000000): MISS (was evicted) → cache=[10,11,00]. Total: 5 misses.',
  },
  {
    id: 29,
    params: 'm=16, S=8, E=2, B=16',
    question:
      'Cache: m=16, S=8, E=2, B=16. b=4, s=3, t=9. What set does address 0xAB12 map to?',
    options: ['Set 0', 'Set 1', 'Set 2', 'Set 3'],
    answer: 1,
    explanation:
      '0xAB12 = 1010 1011 0001 0010. Offset = bits 0-3 = 0010. Set index = bits 4-6 = 001 = 1. Tag = bits 7-15. Address 0xAB12 maps to set 1.',
  },
  {
    id: 30,
    params: 'Capacity vs conflict miss',
    question:
      'A 2-way set-associative cache has 2 sets (S=2, E=2, 4 lines total). A program accesses blocks A, B (both in set 0), then C (set 0, evicts A), then A again. The re-access of A is a:',
    options: ['Cold miss', 'Conflict miss', 'Capacity miss', 'Not a miss'],
    answer: 1,
    explanation:
      'Block A was in cache but evicted when C mapped to the same set. A fully associative cache with 4 lines could hold A, B, and C simultaneously (working set = 3 blocks < 4 lines). Since the miss would not occur with a fully associative cache of the same total size, it is a conflict miss — caused by set contention, not insufficient capacity.',
  },
  {
    id: 31,
    params: 'Stride with doubles',
    question:
      'Stride access: word_size=8 bytes (doubles), stride k=4, block size B=64. What is the miss rate?',
    options: ['25%', '50%', '75%', '100%'],
    answer: 1,
    explanation:
      'Miss rate = min(1, (word_size × k) / B) × 100 = min(1, (8 × 4) / 64) × 100 = min(1, 32/64) × 100 = 50%. Every other cache block boundary is crossed, so half the accesses miss.',
  },
  {
    id: 32,
    params: 'm=12, S=4, E=1, B=8',
    question:
      'Cache: m=12, S=4, E=1, B=8. b=3, s=2, t=7. What is the tag for address 0x3D8?',
    options: ['0x1E', '0x1F', '0x3D', '0x07'],
    answer: 0,
    explanation:
      '0x3D8 = 0011 1101 1000. Offset (bits 0-2) = 000. Set (bits 3-4) = 11 = set 3. Tag (bits 5-11) = 0011110 = 30 decimal = 0x1E.',
  },
  {
    id: 33,
    params: 'Write-back dirty eviction',
    question:
      'In a write-back cache, when is data written to main memory?',
    options: [
      'On every write operation',
      'When a dirty cache line is evicted',
      'On every read miss',
      'Only when the program calls flush',
    ],
    answer: 1,
    explanation:
      'Write-back only updates main memory when a dirty (modified) cache line is evicted. Writes go to the cache only, and the dirty bit tracks whether the line has been modified. This reduces memory traffic compared to write-through.',
  },
  {
    id: 34,
    params: 'm=32, S=128, E=4, B=64',
    question: 'What is the total data capacity of a cache with S=128, E=4, B=64?',
    options: ['16 KB', '32 KB', '64 KB', '128 KB'],
    answer: 1,
    explanation:
      'Cache size = S × E × B = 128 × 4 × 64 = 32,768 bytes = 32 KB. This counts only data storage, not tag or valid-bit overhead.',
  },
  {
    id: 35,
    params: 'm=32, S=256, E=1, B=64',
    question:
      'Cache: m=32, S=256, E=1, B=64. How many tag bits per address?',
    options: ['16', '18', '20', '22'],
    answer: 1,
    explanation:
      'b = log₂(64) = 6. s = log₂(256) = 8. t = m - s - b = 32 - 8 - 6 = 18 tag bits.',
  },
  {
    id: 36,
    params: 'S=1, E=2, B=8, m=8 (LRU)',
    question:
      'Fully associative cache: S=1, E=2, B=8, m=8, LRU. Access 0x00, then 0x08, then 0x10. Which block is evicted on the third access?',
    options: ['The block containing 0x00', 'The block containing 0x08', 'The block containing 0x10', 'No eviction needed'],
    answer: 0,
    explanation:
      'b=3, s=0, t=5. 0x00 (tag=00000): MISS, load → cache=[0x00]. 0x08 (tag=00001): MISS, load → cache=[0x00(LRU), 0x08(MRU)]. 0x10 (tag=00010): MISS, cache full → evict LRU = 0x00 block. The block containing 0x00 is evicted.',
  },
  {
    id: 37,
    params: 'm=16, S=32, E=1, B=16',
    question:
      'Cache: m=16, S=32, E=1, B=16. b=4, s=5, t=7. What set does address 0x4E20 map to?',
    options: ['Set 0', 'Set 2', 'Set 14', 'Set 4'],
    answer: 1,
    explanation:
      '0x4E20 = 0100 1110 0010 0000. Offset (bits 0-3) = 0000. Set index (bits 4-8) = 00010 = 2. Tag (bits 9-15) = 0100111. Address 0x4E20 maps to set 2.',
  },
  {
    id: 38,
    params: 'No-write-allocate behavior',
    question:
      'On a write miss with no-write-allocate policy, what happens?',
    options: [
      'The block is loaded into cache, then written',
      'The write goes directly to main memory; the block is NOT loaded into cache',
      'The write is dropped silently',
      'The cache performs a read miss first',
    ],
    answer: 1,
    explanation:
      'No-write-allocate (also called write-around) sends the write directly to main memory without loading the block into cache. This avoids polluting the cache with data that may not be read soon. Typically paired with write-through.',
  },
  {
    id: 39,
    params: 'S=2, E=2, B=4, m=8',
    question:
      'Cache: S=2, E=2, B=4, m=8. b=2, s=1, t=5. Addresses 0x00 and 0x08 both map to set 0 and fill it. Later, 0x00 is accessed again (hit), then 0x08 is evicted by 0x10. On the next access to 0x08, what type of miss occurs?',
    options: ['Cold miss', 'Conflict miss', 'Capacity miss', 'Compulsory miss'],
    answer: 1,
    explanation:
      '0x08 was previously in the cache but was evicted because a third block (0x10) mapped to the same set. The cache has 4 total lines (enough to hold 0x00, 0x08, and 0x10 if fully associative), so this is a conflict miss — caused by set contention, not insufficient total capacity.',
  },
  {
    id: 40,
    params: 'Stride >= block size',
    question:
      'Stride access: word_size=4 bytes, stride k=32 words, block B=64 bytes. What is the miss rate?',
    options: ['50%', '75%', '100%', '25%'],
    answer: 2,
    explanation:
      'Miss rate = min(1, (word_size × k) / B) × 100 = min(1, (4 × 32) / 64) × 100 = min(1, 128/64) × 100 = min(1, 2) × 100 = 100%. The stride (128 bytes) exceeds the block size (64 bytes), so every access misses — no spatial locality benefit.',
  },
]
