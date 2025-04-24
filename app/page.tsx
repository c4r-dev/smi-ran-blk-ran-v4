'use client'; // Needed for useState and event handlers

import React, { useState } from 'react';
import { generateBlockedRandomization } from '../lib/randomization'; // Import the utility

export default function Home() {
  const [groupsInput, setGroupsInput] = useState<string>('A, B'); // Default groups
  const [blockSizeInput, setBlockSizeInput] = useState<string>('4'); // Default block size
  const [randomizedSequence, setRandomizedSequence] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const handleGenerate = () => {
    setError(''); // Clear previous errors
    setRandomizedSequence([]); // Clear previous results

    const groups = groupsInput.split(',').map(g => g.trim()).filter(g => g); // Split and clean input
    const blockSize = parseInt(blockSizeInput, 10);

    if (groups.length === 0) {
        setError('Please enter at least one group name.');
        return;
    }

    if (isNaN(blockSize) || blockSize <= 0) {
      setError('Block size must be a positive number.');
      return;
    }

    if (blockSize % groups.length !== 0) {
      setError(`Block size (${blockSize}) must be a multiple of the number of groups (${groups.length}).`);
      return;
    }

    // Generate the sequence using the utility function
    const sequence = generateBlockedRandomization(groups, blockSize);
    if (sequence.length > 0) {
        setRandomizedSequence(sequence);
    } else {
        // Handle potential errors from the generation function if needed,
        // although current validation should catch most issues.
        setError('Failed to generate sequence. Check inputs.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '80px auto 20px auto' }}> {/* Adjust top margin */}
       <h2>Block Randomization Generator</h2> {/* Heading style */}

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="groups" style={{ display: 'block', marginBottom: '5px' }}>
          Treatment Groups (comma-separated):
        </label>
        <input
          type="text"
          id="groups"
          value={groupsInput}
          onChange={(e) => setGroupsInput(e.target.value)}
          placeholder="e.g., A, B, C"
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="blockSize" style={{ display: 'block', marginBottom: '5px' }}>
          Block Size (must be multiple of #groups):
        </label>
        <input
          type="number"
          id="blockSize"
          value={blockSizeInput}
          onChange={(e) => setBlockSizeInput(e.target.value)}
          placeholder="e.g., 4"
          style={{ width: '100px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <button
        onClick={handleGenerate}
        className="button" // Button class from globals.css
        style={{ padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}
       >
        Generate Sequence
      </button>

      {error && (
        <p style={{ color: 'red', marginTop: '15px', fontWeight: 'bold' }}>
          Error: {error}
        </p>
      )}

      {randomizedSequence.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Generated Sequence (One Block):</h3>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', background: '#f0f0f0', padding: '10px', borderRadius: '4px', wordWrap: 'break-word' }}>
             {/* Uses JetBrains Mono font */}
            {randomizedSequence.join(', ')}
          </p>
           <p style={{fontSize: '0.9em', color: '#555'}}>Note: This shows one shuffled block based on your inputs.</p>
        </div>
      )}
    </div>
  );
}