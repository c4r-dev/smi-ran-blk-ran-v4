// app/components/Legend.js
import { Box, Typography, Stack, Chip } from '@mui/material';

export default function Legend({ generatedNumTreatments, treatmentColors }) {
  if (!generatedNumTreatments) return null;

  return (
    <Box sx={{ mb: 3, p: 2, border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Legend
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {Object.entries(treatmentColors)
          .slice(0, generatedNumTreatments)
          .map(([treatment, color]) => (
            <Chip
              key={treatment}
              label={`Treatment ${treatment}`}
              sx={{
                backgroundColor: color,
                border: 1,
                borderColor: 'grey.400',
                '& .MuiChip-label': {
                  fontWeight: 500,
                },
              }}
            />
          ))}
      </Stack>
    </Box>
  );
}