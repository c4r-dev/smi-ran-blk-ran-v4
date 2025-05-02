// app/page.tsx
'use client'; // Needed for useState and event handlers

import React, { useState, useMemo } from 'react';
import {
  generateBlockedRandomization,
  RandomizationResult, // Import the updated interface from lib
} from '../lib/randomization'; // Assuming this path is correct

// --- Define colors for treatments (adjust colors as needed) ---
const treatmentColors: { [key: string]: string } = {
  'A': '#FFCDD2', // Light Red
  'B': '#C5CAE9', // Light Indigo
  'C': '#B2DFDB', // Light Teal
  'D': '#FFF9C4', // Light Yellow
  'E': '#FCE4EC', // Light Pink
  'F': '#D1C4E9', // Light Purple
  // Add more letters and colors if you expect more treatments
};
const defaultTreatmentColor = '#E0E0E0'; // Grey for any unexpected treatment

// --- Function to get color based on treatment ---
function getColorForTreatment(treatment: string): string {
  return treatmentColors[treatment] || defaultTreatmentColor;
}

// No longer need CorrectedRandomizationResult interface, use imported RandomizationResult
// interface CorrectedRandomizationResult {
//     blockIndex: number;
//     treatment: string;
//     subjectIndex: number; // Add subjectIndex here
// }


export default function Home() {
  const [numSubjectsInput, setNumSubjectsInput] = useState<string>('24');
  const [numBlocksInput, setNumBlocksInput] = useState<string>('4');
  const [numTreatmentsInput, setNumTreatmentsInput] = useState<string>('3');
  // --- Use the imported RandomizationResult type ---
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
    } else if (result.sequence && result.sequence.length > 0) {
      // --- Ensure the state update uses the correct type ---
      setRandomizedSequence(result.sequence); // No need for 'as' if types match
      setGeneratedBlockSize(result.blockSize ?? null);
    } else {
      setError('Failed to generate sequence. Please check inputs.');
    }
  };

  // Group sequence by block index using useMemo for optimization
  const groupedSequence = useMemo(() => {
    if (!randomizedSequence || randomizedSequence.length === 0) {
       // --- Ensure map type matches state type ---
      return new Map<number, RandomizationResult[]>();
    }
     // --- Ensure map type matches state type ---
    const map = new Map<number, RandomizationResult[]>();
    randomizedSequence.forEach((item) => {
      const blockList = map.get(item.blockIndex) || [];
      blockList.push(item);
      map.set(item.blockIndex, blockList);
    });
    // Sort map by block index (keys) - essential for correct display order
    return new Map([...map.entries()].sort((a, b) => a[0] - b[0]));
  }, [randomizedSequence]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '80px auto 20px auto' }}>
      <h2>Block Randomization Generator</h2>

      {/* Input fields section (Unchanged) */}
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
            max="26" // Assuming A-Z
            style={{ width: '100px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
      </div>

      {/* Generate Button (Unchanged) */}
      <button
        onClick={handleGenerate}
        className="button" // Assumes button styles are in globals.css
        style={{ padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', marginBottom: '20px' }}
      >
        Generate Sequence
      </button>

      {/* Legend (Unchanged) */}
      <div style={{ marginTop: '20px', marginBottom: '20px', padding: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
        <h4 style={{ marginTop: '0', marginBottom: '10px' }}>Legend</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          {Object.entries(treatmentColors).map(([treatment, color]) => (
            <div key={treatment} style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '18px',
                  height: '18px',
                  marginRight: '8px',
                  backgroundColor: color,
                  border: '1px solid #ccc', // Add border for lighter colors
                }}
              ></span>
              <span>Treatment {treatment}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Message (Unchanged) */}
      {error && (
        <p style={{ color: 'red', marginTop: '15px', fontWeight: 'bold' }}>
          Error: {error}
        </p>
      )}

      {/* --- Output Section (MODIFIED) --- */}
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
                  {blockItems.map((item, itemIndex) => ( // item now includes subjectIndex
                    <span
                      key={`${blockIndex}-${itemIndex}`} // More robust key
                      style={{
                        display: 'inline-block',
                        padding: '3px 6px',
                        borderRadius: '3px',
                        backgroundColor: getColorForTreatment(item.treatment), // Color still based on treatment
                        border: '1px solid #ccc',
                        minWidth: '25px', // May need adjustment depending on number size
                        textAlign: 'center'
                      }}
                      // --- Updated title (tooltip) ---
                      title={`Subject ${item.subjectIndex + 1}: Treatment ${item.treatment}, Block ${item.blockIndex + 1}`}
                    >
                      {/* --- MODIFIED CONTENT: Show subject number (1-based) --- */}
                      {item.subjectIndex + 1}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Updated explanatory text */}
          <p style={{ fontSize: '0.9em', color: '#555', marginTop: '15px' }}>
             Each row represents a block. Within each block, subjects (numbers) are assigned treatments (indicated by color). Hover over a subject number to see its details.
          </p>
        </div>
      )}
      {/* --- End Output Section --- */}
    </div>
  );
}