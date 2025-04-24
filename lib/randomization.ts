// Simple Fisher-Yates (Knuth) shuffle algorithm
function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  
  // Function to generate randomized blocks
  export function generateBlockedRandomization(
    groups: string[],
    blockSize: number
  ): string[] {
    if (!groups || groups.length === 0 || blockSize <= 0 || blockSize % groups.length !== 0) {
      // Basic validation: Ensure block size is a multiple of the number of groups
      // In a real app, you'd want more robust error handling/feedback
      console.error("Invalid input: Block size must be a positive multiple of the number of groups.");
      return [];
    }
  
    const assignmentsPerBlock = blockSize / groups.length;
    let block: string[] = [];
  
    // Create one block template
    groups.forEach(group => {
      for (let i = 0; i < assignmentsPerBlock; i++) {
        block.push(group);
      }
    });
  
    // Shuffle the block template
    const randomizedBlock = shuffle([...block]); // Shuffle a copy
  
    // In a real scenario, you'd generate multiple blocks and concatenate them
    // For this example, we'll just return one randomized block
    return randomizedBlock;
  }