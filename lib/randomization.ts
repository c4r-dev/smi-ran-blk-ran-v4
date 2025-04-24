// lib/randomization.ts

export interface RandomizationResult {
  treatment: string; // e.g., 'A', 'B'
  blockIndex: number; // 0, 1, 2...
}

// Simple Fisher-Yates (Knuth) shuffle algorithm
function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// Function to generate treatment labels (A, B, C...)
function generateTreatmentLabels(numTreatments: number): string[] {
  const labels: string[] = [];
  for (let i = 0; i < numTreatments; i++) {
    labels.push(String.fromCharCode(65 + i)); // 65 is ASCII for 'A'
  }
  return labels;
}

// Updated function to generate randomized blocks
export function generateBlockedRandomization(
  numSubjects: number,
  numBlocks: number,
  numTreatments: number
): { sequence: RandomizationResult[]; error?: string; blockSize?: number } {
  // --- Input Validation ---
  if (numSubjects <= 0 || numBlocks <= 0 || numTreatments <= 0) {
    return { sequence: [], error: 'Subjects, blocks, and treatments must be positive numbers.' };
  }
  if (numSubjects % numBlocks !== 0) {
    return {
      sequence: [],
      error: `Number of subjects (${numSubjects}) must be divisible by the number of blocks (${numBlocks}).`,
    };
  }
  const blockSize = numSubjects / numBlocks;
  if (blockSize % numTreatments !== 0) {
    return {
      sequence: [],
      error: `Block size (${blockSize}, calculated as Subjects/Blocks) must be divisible by the number of treatments (${numTreatments}).`,
    };
  }
   if (numTreatments > 26) {
     return { sequence: [], error: 'Maximum number of treatments supported is 26 (A-Z).' };
   }

  // --- Randomization Logic ---
  const treatmentLabels = generateTreatmentLabels(numTreatments);
  const assignmentsPerTreatmentPerBlock = blockSize / numTreatments;
  const fullSequence: RandomizationResult[] = [];

  // Create and shuffle each block
  for (let i = 0; i < numBlocks; i++) {
    let currentBlockTemplate: string[] = [];
    // Create the template for one block
    treatmentLabels.forEach((label) => {
      for (let j = 0; j < assignmentsPerTreatmentPerBlock; j++) {
        currentBlockTemplate.push(label);
      }
    });

    // Shuffle the current block
    const shuffledBlock = shuffle(currentBlockTemplate);

    // Add the shuffled block to the full sequence with block index
    shuffledBlock.forEach((treatment) => {
      fullSequence.push({ treatment: treatment, blockIndex: i });
    });
  }

  return { sequence: fullSequence, blockSize: blockSize };
}