// app/page.tsx
'use client'; // Needed for useState and event handlers

import React, { useState, useMemo } from 'react'; // Added useMemo
import {
  generateBlockedRandomization,
  RandomizationResult,
} from '../lib/randomization';

// Simple function to generate distinct colors for blocks
const blockColors = [
  '#E0F7FA', // Light Cyan
  '#FFF9C4', // Light Yellow
  '#FCE4EC', // Light Pink
  '#F1F8E9', // Light Green
  '#EDE7F6', // Light Purple
  '#FFF3E0', // Light Orange
  '#E8EAF6', // Light Indigo
  '#E0F2F1', // Light Teal
];

function getColorForBlock(blockIndex: number): string {
  return blockColors[blockIndex % blockColors.length]; // Cycle through colors
}

export default function Home() {
  const [numSubjectsInput, setNumSubjectsInput] = useState<string>('24');
  const [numBlocksInput, setNumBlocksInput] = useState<string>('4');
  const [numTreatmentsInput, setNumTreatmentsInput] = useState<string>('3');
  const [randomizedSequence, setRandomizedSequence] = useState<RandomizationResult[]>([]);
  const [error, setError] = useState<string>('');
  const [generatedBlockSize, setGeneratedBlockSize] = useState<number | null>(null);

  const handleGenerate = () => {
    setError('');
    setRandomizedSequence([]);
    setGeneratedBlockSize(null);

    const numSubjects = parseInt(numSubjectsInput, 10);
    const numBlocks = parseInt(numBlocksInput, 10);
    const numTreatments = parseInt(numTreatmentsInput, 10);

    const result = generateBlockedRandomization(
      numSubjects,
      numBlocks,
      numTreatments
    );

    if (result.error) {
      setError(result.error);
    } else if (result.sequence.length > 0) {
      setRandomizedSequence(result.sequence);
      setGeneratedBlockSize(result.blockSize ?? null);
    } else {
      setError('Failed to generate sequence. Please check inputs.');
    }
  };

  // --- Group sequence by block index using useMemo for optimization ---
  const groupedSequence = useMemo(() => {
    if (!randomizedSequence || randomizedSequence.length === 0) {
      return new Map<number, RandomizationResult[]>();
    }
    const map = new Map<number, RandomizationResult[]>();
    randomizedSequence.forEach((item) => {
      const blockList = map.get(item.blockIndex) || [];
      blockList.push(item);
      map.set(item.blockIndex, blockList);
    });
    // Sort map by block index (keys) - essential for correct display order
    return new Map([...map.entries()].sort((a, b) => a[0] - b[0]));
  }, [randomizedSequence]);
  // --- End grouping ---

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '80px auto 20px auto' }}>
      <h2>Block Randomization Generator</h2>

      {/* Input fields section (same as before) */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <label htmlFor="numSubjects" style={{ display: 'block', marginBottom: '5px' }}>
            Number of Subjects:
          </label>
          <input
            type="number"
            id="numSubjects"
            value={numSubjectsInput}
            onChange={(e) => setNumSubjectsInput(e.target.value)}
            placeholder="e.g., 24"
            min="1"
            style={{ width: '100px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label htmlFor="numBlocks" style={{ display: 'block', marginBottom: '5px' }}>
            Number of Blocks:
          </label>
          <input
            type="number"
            id="numBlocks"
            value={numBlocksInput}
            onChange={(e) => setNumBlocksInput(e.target.value)}
            placeholder="e.g., 4"
            min="1"
            style={{ width: '100px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label htmlFor="numTreatments" style={{ display: 'block', marginBottom: '5px' }}>
            Number of Treatments:
          </label>
          <input
            type="number"
            id="numTreatments"
            value={numTreatmentsInput}
            onChange={(e) => setNumTreatmentsInput(e.target.value)}
            placeholder="e.g., 3"
            min="1"
            max="26"
            style={{ width: '100px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="button"
        style={{ padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', marginBottom: '20px' }}
      >
        Generate Sequence
      </button>

      {error && (
        <p style={{ color: 'red', marginTop: '15px', fontWeight: 'bold' }}>
          Error: {error}
        </p>
      )}

      {/* --- Updated Output Section --- */}
      {groupedSequence.size > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>
            Generated Sequence (Total Subjects: {randomizedSequence.length}, Block Size: {generatedBlockSize ?? 'N/A'})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}> {/* Column layout for blocks */}
            {Array.from(groupedSequence.entries()).map(([blockIndex, blockItems]) => (
              <div key={blockIndex} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Block Label */}
                <span style={{ fontWeight: 'bold', minWidth: '70px', textAlign: 'right' }}>
                  Block {blockIndex + 1}:
                </span>
                {/* Treatments within the block */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', fontFamily: 'JetBrains Mono, monospace', lineHeight: '1.6' }}>
                  {blockItems.map((item, itemIndex) => (
                    <span
                      key={itemIndex} // Use itemIndex within the block for key
                      style={{
                        display: 'inline-block',
                        padding: '3px 6px',
                        borderRadius: '3px',
                        backgroundColor: getColorForBlock(item.blockIndex),
                        border: '1px solid #ccc',
                        minWidth: '25px',
                        textAlign: 'center'
                      }}
                      title={`Block ${item.blockIndex + 1}`} // Tooltip can remain simple or show subject index if needed
                    >
                      {item.treatment}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.9em', color: '#555', marginTop: '15px' }}>
             Each row represents a block. Treatments (letters) are assigned randomly within each block. Colors indicate the block.
          </p>
        </div>
      )}
      {/* --- End Updated Output Section --- */}
    </div>
  );
}