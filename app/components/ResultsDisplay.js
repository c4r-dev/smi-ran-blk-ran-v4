// app/components/ResultsDisplay.js
import { Box, Typography, Stack, Alert, Chip } from '@mui/material';

export default function ResultsDisplay({ 
  groupedSequence, 
  generationDetails, 
  getColorForTreatment,
  error,
  warning 
}) {
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (warning) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        {warning}
      </Alert>
    );
  }

  if (groupedSequence.size === 0 || !generationDetails) {
    return null;
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h2" gutterBottom>
        Generated Sequence Details
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Target Sample Size: {generationDetails.targetSampleSize ?? 'N/A'} |{' '}
        Actual Allocation Size: {generationDetails.actualAllocationSize ?? 'N/A'} |{' '}
        Number of Blocks: {generationDetails.numBlocks ?? 'N/A'} |{' '}
        Block Size Used: {generationDetails.blockSize ?? 'N/A'} |{' '}
        Treatments: {generationDetails.numTreatments ?? 'N/A'}
      </Typography>

      <Stack spacing={3}>
        {Array.from(groupedSequence.entries()).map(([blockIndex, blockItems]) => (
          <Box key={blockIndex}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  minWidth: 80, 
                  fontWeight: 600,
                  textAlign: 'right'
                }}
              >
                Block {blockIndex + 1}:
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {blockItems.map((item, itemIndex) => (
                  <Chip
                    key={`${blockIndex}-${itemIndex}`}
                    label={item.subjectIndex + 1}
                    size="small"
                    sx={{
                      backgroundColor: getColorForTreatment(item.treatment),
                      border: 1,
                      borderColor: 'grey.400',
                      minWidth: 40,
                      fontFamily: 'monospace',
                      fontWeight: 500,
                    }}
                    title={`Subject Index: ${item.subjectIndex + 1} | Treatment: ${item.treatment} | Block: ${item.blockIndex + 1}`}
                  />
                ))}
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        Each row represents a block. One of all the possible permutations of treatment allocations 
        for this block size is randomly assigned for each block. Colors indicate the treatment.
      </Typography>
    </Box>
  );
}