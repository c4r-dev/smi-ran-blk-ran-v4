// app/page.tsx
'use client'; // Needed for useState and event handlers

import React, { useState, useMemo } from 'react';
import {
  generateBlockedRandomization,
  RandomizationResult, // Import the updated interface from lib
} from '../lib/randomization'; // review path

// --- Define colors for treatments (adjust colors as needed) ---
const treatmentColors: { [key: string]: string } = {
  'A': '#FFCDD2', // Light Red
  'B': '#C5CAE9', // Light Indigo
  'C': '#B2DFDB', // Light Teal
  'D': '#FFF9C4', // Light Yellow
  'E': '#FCE4EC', // Light Pink
  'F': '#D1C4E9', // Light Purple
  'G': '#C8E6C9', // Light Green
  'H': '#FFCCBC', // Light Deep Orange
  'I': '#CFD8DC', // Light Blue Grey
  'J': '#D7CCC8', // Light Brown
  // Only define up to J (10 treatments)
};
const defaultTreatmentColor = '#E0E0E0'; // Grey for any unexpected treatment

// --- Function to get color based on treatment ---
function getColorForTreatment(treatment: string): string {
  return treatmentColors[treatment] || defaultTreatmentColor;
}

// Use imported RandomizationResult type
export default function Home() {
  const [numSubjectsInput, setNumSubjectsInput] = useState<string>('24');
  const [numBlocksInput, setNumBlocksInput] = useState<string>('6');
  const [numTreatmentsInput, setNumTreatmentsInput] = useState<string>('3');
  const [randomizedSequence, setRandomizedSequence] = useState<RandomizationResult[]>([]);
  const [error, setError] = useState<string>('');
  const [generatedBlockSize, setGeneratedBlockSize] = useState<number | null>(null);
  const [generatedNumTreatments, setGeneratedNumTreatments] = useState<number | null>(null);


  const handleGenerate = () => {
    setError('');
    setRandomizedSequence([]);
    setGeneratedBlockSize(null);
    setGeneratedNumTreatments(null);

    const numSubjects = parseInt(numSubjectsInput, 10);
    const numBlocks = parseInt(numBlocksInput, 10);
    const numTreatments = parseInt(numTreatmentsInput, 10);

    // Frontend check for ranges
    if (numSubjects < 2 || numSubjects > 500) {
      setError('Target Sample Size must be between 2 and 500.');
      return;
    }
    if (numBlocks < 2) {
      setError('Block Size must be 2 or greater.');
      return;
    }
    if (numTreatments < 2 || numTreatments > 10) {
      setError('Number of Treatments must be between 2 and 10.');
      return;
    }

    const result = generateBlockedRandomization(
      numSubjects,
      numBlocks,
      numTreatments
    );

    if (result.error) {
      setError(result.error);
    } else if (result.sequence && result.sequence.length > 0) {
      setRandomizedSequence(result.sequence);
      setGeneratedBlockSize(result.numBlocks ?? null);
      setGeneratedNumTreatments(numTreatments);
    } else {
      setError('Failed to generate sequence. Please check inputs.');
    }
  };

  // Group sequence by block index using useMemo for optimization
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
    return new Map([...map.entries()].sort((a, b) => a[0] - b[0]));
  }, [randomizedSequence]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '40px auto 20px auto' }}>
      {/* <h2>Block Randomization Generator</h2> */}

      {/* Input fields section (Unchanged) */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <label htmlFor="numSubjects" style={{ display: 'block', marginBottom: '5px' }}>
            Target Sample Size:
          </label>
          <input
            type="number"
            id="numSubjects"
            value={numSubjectsInput}
            onChange={(e) => setNumSubjectsInput(e.target.value)}
            placeholder="e.g., 24"
            min="2"
            max="500"
            style={{ width: '100px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label htmlFor="numBlocks" style={{ display: 'block', marginBottom: '5px' }}>
            Block Size:
          </label>
          <input
            type="number"
            id="numBlocks"
            value={numBlocksInput}
            onChange={(e) => setNumBlocksInput(e.target.value)}
            placeholder="e.g., 4"
            min="2"
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
            min="2"
            max="10"
            style={{ width: '100px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
      </div>

      {/* Generate Button (Unchanged) */}
      <button
        onClick={handleGenerate}
        className="button"
        style={{ padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', marginBottom: '20px' }}
      >
        Generate Sequence
      </button>

      {/* Legend (Unchanged) */}
      {generatedNumTreatments !== null && (
        <div style={{ marginTop: '20px', marginBottom: '20px', padding: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
          <h4 style={{ marginTop: '0', marginBottom: '10px' }}>Legend</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            {Object.entries(treatmentColors)
              .slice(0, generatedNumTreatments)
              .map(([treatment, color]) => (
                <div key={treatment} style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '18px',
                      height: '18px',
                      marginRight: '8px',
                      backgroundColor: color,
                      border: '1px solid #ccc',
                    }}
                  ></span>
                  <span>Treatment {treatment}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Error Message (Unchanged) */}
      {error && (
        <p style={{ color: 'red', marginTop: '15px', fontWeight: 'bold' }}>
          Error: {error}
        </p>
      )}

      {/* --- Output Section (SUBJECT BOX STYLE MODIFIED) --- */}
      {groupedSequence.size > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>
            Generated Sequence (Number of Blocks: {generatedBlockSize ?? 'N/A'})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}> {/* Container for blocks */}
            {Array.from(groupedSequence.entries()).map(([blockIndex, blockItems]) => (
              <div key={blockIndex} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}> {/* Row for single block */}
                {/* Block Label */}
                <span style={{ fontWeight: 'bold', minWidth: '70px', textAlign: 'right' }}>
                  Block {blockIndex + 1}:
                </span>
                {/* Treatments within the block */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', fontFamily: "'JetBrains Mono', monospace", lineHeight: '1.6' }}>
                  {blockItems.map((item: RandomizationResult, itemIndex: number) => (
                    <span
                      key={`${blockIndex}-${itemIndex}`}
                      // --- Style updated: Removed minWidth, added fixed width ---
                      style={{
                        display: 'inline-block',
                        padding: '3px 6px', // Keeps internal padding
                        borderRadius: '3px',
                        backgroundColor: getColorForTreatment(item.treatment),
                        border: '1px solid #ccc',
                        width: '40px',      // Set fixed width
                        textAlign: 'center' // Center number within the fixed width
                      }}
                      title={`Subject ${item.subjectIndex + 1}: Treatment ${item.treatment}, Block ${item.blockIndex + 1}`}
                    >
                      {item.subjectIndex + 1}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <h2>
            <p style={{ fontSize: '0.8em', color: '#555', marginTop: '15px' }}>
              Each row represents a block. One of all the possible permutations of treatment allocations for this block size is randomly assigned for each block. Colors indicate the treatment.</p>
          </h2>
        </div>
      )}
      {/* --- End Output Section --- */}
    </div>
  );
}