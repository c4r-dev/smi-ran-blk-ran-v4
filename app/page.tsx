// app/page.tsx
'use client'; // Needed for useState and event handlers

import React, { useState, useMemo } from 'react';
import {
  generateBlockedRandomization,
  RandomizationResult,
  // Assuming randomization.ts exports these types now:
  // RandomizationSuccessResult, RandomizationErrorResult
} from '../lib/randomization'; // review path if necessary

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
};
const defaultTreatmentColor = '#E0E0E0'; // Grey for any unexpected treatment

// --- Function to get color based on treatment ---
function getColorForTreatment(treatment: string): string {
  return treatmentColors[treatment] || defaultTreatmentColor;
}

// --- Component ---
export default function Home() {
  // --- State Variables ---
  const [numSubjectsInput, setNumSubjectsInput] = useState<string>('24');
  // Changed from numBlocksInput to blockSizeInput
  const [blockSizeInput, setBlockSizeInput] = useState<string>('10');
  const [numTreatmentsInput, setNumTreatmentsInput] = useState<string>('2');

  const [randomizedSequence, setRandomizedSequence] = useState<RandomizationResult[]>([]);
  const [error, setError] = useState<string | null>(null); // Use null for no error
  const [warning, setWarning] = useState<string | null>(null); // State for warnings

  // Renamed from generatedBlockSize to generatedNumBlocks
  const [generatedNumBlocks, setGeneratedNumBlocks] = useState<number | null>(null);
  const [generatedNumTreatments, setGeneratedNumTreatments] = useState<number | null>(null);

  // State to store details from successful generation
  const [generationDetails, setGenerationDetails] = useState<{
     targetSampleSize?: number;
     actualAllocationSize?: number;
     numBlocks?: number;
     blockSize?: number;
     numTreatments?: number;
  } | null>(null);


  // --- Handle Generation ---
  const handleGenerate = () => {
    // Clear previous results/errors/warnings
    setError(null);
    setWarning(null); // Clear warning
    setRandomizedSequence([]);
    setGeneratedNumBlocks(null); // Clear generated number of blocks
    setGeneratedNumTreatments(null); // Clear treatments for legend
    setGenerationDetails(null); // Clear details


    // --- Input Parsing ---
    // Use const for parsed values within this function scope
    const targetNumSubjects = parseInt(numSubjectsInput, 10);
    const blockSize = parseInt(blockSizeInput, 10); // Changed from numBlocks
    const numTreatments = parseInt(numTreatmentsInput, 10);


    // --- Frontend Input Validation (Basic Checks) ---
    if (isNaN(targetNumSubjects) || isNaN(blockSize) || isNaN(numTreatments)) {
        setError("Please ensure all inputs are valid numbers.");
        return;
    }
    // Ranges checked primarily in the backend function, but basic checks here are good UX
    if (targetNumSubjects < 2 || targetNumSubjects > 500) {
      setError('Target Sample Size must be between 2 and 500.');
      return;
    }
    // Removed check for numBlocks < 2, now using blockSize
    if (blockSize <= 0) { // Check if block size is positive
      setError('Block Size must be a positive number.');
      return;
    }
    // Block size must be >= treatments, but the backend function handles this better with specific values
    if (numTreatments < 2 || numTreatments > 10) {
      setError('Number of Treatments must be between 2 and 10.');
      return;
    }


    // --- Call the updated randomization function ---
    const result = generateBlockedRandomization(
      targetNumSubjects,
      blockSize, // Pass blockSize here
      numTreatments
    );


    // --- Process Result using Type Guard ---
    if ('error' in result) {
      // Handle Error Case
      setError(result.error);
      // Clear other states just in case
      setRandomizedSequence([]);
      setWarning(null);
      setGeneratedNumBlocks(null);
      setGeneratedNumTreatments(null);
      setGenerationDetails(null);
    } else {
      // Handle Success Case
      setError(null); // Clear any previous error
      setRandomizedSequence(result.sequence);
      setGeneratedNumBlocks(result.numBlocks); // Store the calculated number of blocks
      setGeneratedNumTreatments(result.numTreatments); // Store treatments for legend
      setGenerationDetails({ // Store details
        targetSampleSize: result.targetSampleSize,
        actualAllocationSize: result.actualAllocationSize,
        numBlocks: result.numBlocks,
        blockSize: result.blockSize,
        numTreatments: result.numTreatments,
      });
      // Set warning if it exists in the result
      setWarning(result.warning || null);
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
    // Sort blocks by index
    return new Map([...map.entries()].sort((a, b) => a[0] - b[0]));
  }, [randomizedSequence]);

  // --- Render Logic ---
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '40px auto 20px auto' }}>

      {/* --- Input fields section --- */}
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
          {/* Changed Label and Input to Block Size */}
          <label htmlFor="blockSize" style={{ display: 'block', marginBottom: '5px' }}>
            Block Size:
          </label>
          <input
            type="number"
            id="blockSize"
            value={blockSizeInput} // Use blockSizeInput state
            onChange={(e) => setBlockSizeInput(e.target.value)} // Use setBlockSizeInput
            placeholder="e.g., 10"
            min="1" // Basic minimum validation
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
            placeholder="e.g., 2"
            min="2"
            max="10"
            style={{ width: '100px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
      </div>

      {/* --- Generate Button --- */}
      <button
        onClick={handleGenerate}
        className="button" // Assuming 'button' class exists in globals.css or similar
        style={{ padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', marginBottom: '20px' }}
      >
        Generate Sequence
      </button>

      {/* --- Legend --- */}
      {/* Display legend only if generation was successful */}
      {generationDetails && generatedNumTreatments !== null && (
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

      {/* --- Display Error --- */}
      {error && (
        <p style={{ color: 'red', marginTop: '15px', fontWeight: 'bold' }}>
          Error: {error}
        </p>
      )}

       {/* --- Display Warning --- */}
      {warning && (
        <p style={{ color: 'orange', marginTop: '15px', fontWeight: 'bold' }}>
          Warning: {warning}
        </p>
      )}

      {/* --- Display Generation Details and Sequence --- */}
      {groupedSequence.size > 0 && generationDetails && (
        <div style={{ marginTop: '20px' }}>
          <h2>Generated Sequence Details</h2>
           <p style={{ fontSize: '0.9em', color: '#333', marginTop: '5px', marginBottom: '15px' }}>
                Target Sample Size: {generationDetails.targetSampleSize ?? 'N/A'} |
                Actual Allocation Size: {generationDetails.actualAllocationSize ?? 'N/A'} |
                Number of Blocks: {generationDetails.numBlocks ?? 'N/A'} |
                Block Size Used: {generationDetails.blockSize ?? 'N/A'} |
                Treatments: {generationDetails.numTreatments ?? 'N/A'}
            </p>

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
                      style={{
                        display: 'inline-block',
                        padding: '3px 6px',
                        borderRadius: '3px',
                        backgroundColor: getColorForTreatment(item.treatment),
                        border: '1px solid #ccc',
                        width: '40px',
                        textAlign: 'center',
                        fontSize: '0.9em' // Slightly smaller font for the number maybe
                      }}
                      title={`Subject Index: ${item.subjectIndex + 1} | Treatment: ${item.treatment} | Block: ${item.blockIndex + 1}`}
                    >
                      {/* Display 1-based subject index relative to actual allocation */}
                      {item.subjectIndex + 1}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.8em', color: '#555', marginTop: '15px' }}>
              Each row represents a block. Allocations within each block are randomly permuted. Colors indicate the assigned treatment group. Subject Index is the overall position in the generated sequence.
          </p>
        </div>
      )}
      {/* --- End Output Section --- */}
    </div>
  );
}