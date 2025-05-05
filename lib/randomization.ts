// lib/randomization.ts

export interface RandomizationResult {
  treatment: string; // e.g., 'A', 'B'
  blockIndex: number; // 0, 1, 2...
  subjectIndex: number; // Overall subject index (0-based)
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

// Function to generate treatment labels (A, B, C... up to J)
function generateTreatmentLabels(numTreatments: number): string[] {
  const labels: string[] = [];
  // Ensure we don't generate more than 10 labels (A-J)
  const count = Math.min(numTreatments, 10);
  for (let i = 0; i < count; i++) {
    labels.push(String.fromCharCode(65 + i)); // 65 is ASCII for 'A'
  }
  return labels;
}

/**
 * Generates a blocked randomization sequence.
 *
 * @param numSubjects The total number of subjects (target sample size).
 * @param blockSize The desired number of subjects within each block.
 * @param numTreatments The number of treatment groups.
 * @returns An object containing the randomization sequence, the calculated number of blocks, or an error message.
 */
export function generateBlockedRandomization(
  numSubjects: number,
  blockSize: number, // Input is now blockSize
  numTreatments: number
): { sequence: RandomizationResult[]; error?: string; numBlocks?: number } { // Returns calculated numBlocks

  // --- Input Validation ---
  // Validate range for Number of Subjects
  if (numSubjects < 2 || numSubjects > 500) {
     return { sequence: [], error: 'Number of Subjects must be between 2 and 500.' };
  }
  // Validate range for Number of Treatments
  if (numTreatments < 2 || numTreatments > 10) {
    return { sequence: [], error: 'Number of Treatments must be between 2 and 10.' };
  }
   // Validate Block Size input
  if (blockSize <= 0) {
     return { sequence: [], error: 'Block Size must be a positive number.' };
  }
  // Block size must be large enough to contain at least one of each treatment
  if (blockSize < numTreatments) {
    return { sequence: [], error: `Block Size (${blockSize}) must be greater than or equal to the number of treatments (${numTreatments}).` };
  }

  // --- Divisibility Checks ---
  // Check 1: Target Sample Size must be divisible by Block Size
  if (numSubjects % blockSize !== 0) {
    return {
      sequence: [],
      error: `Number of subjects (${numSubjects}) must be divisible by the block size (${blockSize}). The result must be a whole number for the number of blocks.`,
    };
  }
   // Check 2: Block Size must be divisible by Number of Treatments
  if (blockSize % numTreatments !== 0) {
    return {
      sequence: [],
      error: `Block size (${blockSize}) must be divisible by the number of treatments (${numTreatments}) to ensure equal allocation within blocks.`,
    };
  }

  // --- Calculate Number of Blocks ---
  // This is derived based on user input for numSubjects and blockSize
  const numBlocks = numSubjects / blockSize;

  // --- Randomization Logic ---
  const treatmentLabels = generateTreatmentLabels(numTreatments);
  // Calculate how many times each treatment appears in a single block
  const assignmentsPerTreatmentPerBlock = blockSize / numTreatments;
  const fullSequence: RandomizationResult[] = [];
  let overallSubjectIndex = 0; // Keep track of the subject number across all blocks

  // Generate each block
  for (let i = 0; i < numBlocks; i++) {
    // Create the template for the current block (contains the required number of each treatment label)
    const currentBlockTemplate: string[] = [];
    treatmentLabels.forEach((label) => {
      for (let j = 0; j < assignmentsPerTreatmentPerBlock; j++) {
        currentBlockTemplate.push(label);
      }
    });

    // Shuffle the assignments within the current block
    const shuffledBlock = shuffle(currentBlockTemplate);

    // Add the shuffled assignments to the full sequence
    shuffledBlock.forEach((treatment) => {
      fullSequence.push({
        treatment: treatment,     // Assigned treatment (e.g., 'A', 'B')
        blockIndex: i,            // Index of the current block (0-based)
        subjectIndex: overallSubjectIndex // Overall subject index (0-based)
      });
      overallSubjectIndex++; // Increment for the next subject
    });
  }

  // Return the generated sequence and the calculated number of blocks
  return { sequence: fullSequence, numBlocks: numBlocks };
}