// app/layout.js
'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import Image from 'next/image';
import { theme } from '../lib/ui/theme/muiTheme';

export default function RootLayout({ children }) {
  const handleResetClick = () => {
    window.location.reload();
  };

  return (
    <html lang="en">
      <head>
        <title>Block Randomization Generator</title>
        <meta name="description" content="Learn block randomization interactively" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar position="fixed" color="default" elevation={1}>
            <Toolbar>
              <IconButton
                edge="start"
                onClick={handleResetClick}
                title="Reset Application"
                sx={{ mr: 2 }}
              >
                <Image
                  src="/favicon.ico"
                  alt="Logo - Reset"
                  width={32}
                  height={32}
                  priority
                />
              </IconButton>
              <Typography variant="h1" component="h1" sx={{ flexGrow: 1 }}>
                Block Randomization Generator
              </Typography>
            </Toolbar>
          </AppBar>
          <Box component="main" sx={{ mt: 8, p: 3 }}>
            {children}
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}