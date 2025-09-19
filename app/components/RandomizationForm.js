// app/components/RandomizationForm.js
import { Box, TextField, Button, Stack, Typography } from '@mui/material';

export default function RandomizationForm({
  numSubjectsInput,
  setNumSubjectsInput,
  blockSizeInput,
  setBlockSizeInput,
  numTreatmentsInput,
  setNumTreatmentsInput,
  onGenerate
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
        When you are setting up block randomization, you have to know sample size, block size and number of treatments, and then standard code can randomize for you. Try it out!
      </Typography>
      <Stack alignItems="end">
        <TextField
          label="Target Sample Size"
          type="number"
          value={numSubjectsInput}
          onChange={(e) => setNumSubjectsInput(e.target.value)}
          placeholder="e.g., 24"
          inputProps={{ min: 2, max: 500 }}
          sx={{ 
            minWidth: { xs: 'auto', sm: 180 },
            width: { xs: '100%', sm: 180 }
          }}
        />
        <TextField
          label="Block Size"
          type="number"
          value={blockSizeInput}
          onChange={(e) => setBlockSizeInput(e.target.value)}
          placeholder="e.g., 10"
          inputProps={{ min: 1 }}
          sx={{ 
            width: { xs: '100%', sm: 100 },
            maxWidth: { xs: 'none', sm: 100 }
          }}
        />
        <TextField
          label="Number of Treatments"
          type="number"
          value={numTreatmentsInput}
          onChange={(e) => setNumTreatmentsInput(e.target.value)}
          placeholder="e.g., 2"
          inputProps={{ min: 2, max: 10 }}
          sx={{ 
            minWidth: { xs: 'auto', sm: 180 },
            width: { xs: '100%', sm: 180 }
          }}
        />
        <Button
          variant="contained"
          onClick={onGenerate}
        >
          Generate Sequence
        </Button>
      </Stack>
    </Box>
  );
}