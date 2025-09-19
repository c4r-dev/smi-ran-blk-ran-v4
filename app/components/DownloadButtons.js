// app/components/DownloadButtons.js
import { Box, Typography, Button, Stack } from '@mui/material';
import { Download } from '@mui/icons-material';

export default function DownloadButtons({ hasGenerated }) {
  if (!hasGenerated) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Download code:
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Download />}
          href="/blockRandomization.py"
          download
          title="Download Python script"
        >
          Python (.py)
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Download />}
          href="/blockRandomization.R"
          download
          title="Download R script"
        >
          R (.R)
        </Button>
      </Stack>
    </Box>
  );
}