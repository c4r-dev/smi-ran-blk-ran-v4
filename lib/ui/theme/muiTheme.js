// lib/ui/theme/muiTheme.js
import { createTheme } from '@mui/material/styles';

// Font face definitions
const fontFaces = `
  @font-face {
    font-family: 'General Sans';
    src: url('/fonts/GeneralSans/GeneralSans-Regular.woff2') format('woff2'),
         url('/fonts/GeneralSans/GeneralSans-Regular.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'General Sans';
    src: url('/fonts/GeneralSans/GeneralSans-Bold.woff2') format('woff2'),
         url('/fonts/GeneralSans/GeneralSans-Bold.woff') format('woff');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'JetBrains Mono';
    src: url('/fonts/JetBrainsMono-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

// Inject fonts into the document head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = fontFaces;
  document.head.appendChild(style);
}

// 7-color palette - these are the ONLY colors the app can use
export const appColors = {
  primary: '#020202',    // Black - primary actions, text
  accent: '#6F00FF',     // Purple - hover states, highlights  
  neutral: '#6b7280',    // Gray - secondary text, borders
  success: '#10b981',    // Green - success states
  warning: '#f59e0b',    // Orange - warnings
  error: '#ef4444',      // Red - errors, destructive actions
  background: '#ffffff', // White - backgrounds, surfaces
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: appColors.primary,
      contrastText: appColors.background,
    },
    secondary: {
      main: appColors.accent,
      contrastText: appColors.background,
    },
    success: {
      main: appColors.success,
      contrastText: appColors.background,
    },
    warning: {
      main: appColors.warning,
      contrastText: appColors.background,
    },
    error: {
      main: appColors.error,
      contrastText: appColors.background,
    },
    background: {
      default: appColors.background,
      paper: appColors.background,
    },
    text: {
      primary: appColors.primary,
      secondary: appColors.neutral,
    },
    divider: appColors.neutral,
    // Override default greys with our neutral color
    grey: {
      50: appColors.background,
      100: appColors.background,
      200: appColors.neutral + '20', // 20% opacity
      300: appColors.neutral + '40', // 40% opacity
      400: appColors.neutral + '60', // 60% opacity
      500: appColors.neutral,
      600: appColors.neutral,
      700: appColors.primary,
      800: appColors.primary,
      900: appColors.primary,
    },
  },
  typography: {
    fontFamily: "'General Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    // 7 responsive typography sizes - largest to smallest
    h1: {
      fontSize: 'clamp(1.5rem, 4vw, 2rem)',    // 24-32px - Main titles
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', // 20-24px - Section headings
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)', // 18-20px - Subsection headings
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',    // 14-16px - Primary body text
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', // 12-14px - Standard text (buttons, secondary)
      fontWeight: 400,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: 'clamp(0.625rem, 1vw, 0.75rem)',  // 10-12px - Small text, labels
      fontWeight: 400,
      lineHeight: 1.4,
    },
    button: {
      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', // 12-14px - Same as body2
      fontWeight: 500,
      lineHeight: 1.2,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 6,
  },
  spacing: 8, // 8px base unit
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.typography.body2,
          fontWeight: 500,
          textTransform: 'none',
          // Responsive padding and sizing
          [theme.breakpoints.down('sm')]: {
            paddingY: theme.spacing(1),
            paddingX: theme.spacing(1.5),
            minWidth: 120,
          },
          [theme.breakpoints.up('sm')]: {
            paddingY: theme.spacing(1.5),
            paddingX: theme.spacing(2),
            minWidth: 160,
          },
        }),
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: ({ theme }) => ({
          // Responsive widths
          [theme.breakpoints.down('sm')]: {
            minWidth: 'auto',
            width: '100%',
          },
        }),
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          // Responsive padding
          [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
          },
          [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
          },
        }),
      },
    },
    MuiStack: {
      defaultProps: {
        // Make all stacks responsive by default
        direction: { xs: 'column', sm: 'row' },
        spacing: { xs: 1, sm: 2 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          // Responsive chip sizing
          [theme.breakpoints.down('sm')]: {
            fontSize: '0.75rem',
            height: 24,
          },
          [theme.breakpoints.up('sm')]: {
            fontSize: '0.875rem',
            height: 32,
          },
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          // Responsive app bar padding
          '& .MuiToolbar-root': {
            [theme.breakpoints.down('sm')]: {
              paddingLeft: theme.spacing(1),
              paddingRight: theme.spacing(1),
            },
            [theme.breakpoints.up('sm')]: {
              paddingLeft: theme.spacing(2),
              paddingRight: theme.spacing(2),
            },
          },
        }),
      },
    },
  },
});

// Treatment colors for randomization
export const treatmentColors = {
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
  default: '#E0E0E0', // Grey for unexpected treatments
};