import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9B4F2B',
      light: '#B67D62',
      dark: '#723A20',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F2E2D0',
      light: '#F7EDE3',
      dark: '#D9C4B0',
      contrastText: '#1A1A1A',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#4B4B4B',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      background: 'linear-gradient(135deg, #9B4F2B 0%, #B67D62 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(155, 79, 43, 0.3)',
            '&::before': {
              left: '100%',
            },
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #9B4F2B 0%, #B67D62 100%)',
          boxShadow: '0 4px 15px rgba(155, 79, 43, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #723A20 0%, #9B4F2B 100%)',
            boxShadow: '0 8px 25px rgba(155, 79, 43, 0.4)',
          },
        },
        outlined: {
          borderWidth: '2px',
          borderColor: '#9B4F2B',
          color: '#9B4F2B',
          '&:hover': {
            borderWidth: '2px',
            borderColor: '#723A20',
            backgroundColor: 'rgba(155, 79, 43, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(242, 226, 208, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 40px rgba(155, 79, 43, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '& fieldset': {
              borderColor: '#F2E2D0',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: '#D9C4B0',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#9B4F2B',
              boxShadow: '0 0 0 3px rgba(155, 79, 43, 0.1)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(242, 226, 208, 0.3)',
          boxShadow: '0 4px 20px rgba(155, 79, 43, 0.1)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '16px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            color: '#9B4F2B',
            transform: 'translateY(-1px)',
          },
          '&.Mui-selected': {
            color: '#9B4F2B',
            fontWeight: 600,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: 'rgba(155, 79, 43, 0.1)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '2px solid rgba(155, 79, 43, 0.2)',
          '&:hover': {
            transform: 'scale(1.1)',
            border: '2px solid #9B4F2B',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(242, 226, 208, 0.3)',
          boxShadow: '0 8px 30px rgba(155, 79, 43, 0.15)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(155, 79, 43, 0.1)',
            transform: 'translateX(4px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          animation: 'pulse 2s ease-in-out infinite',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
            },
            '50%': {
              transform: 'scale(1.1)',
            },
            '100%': {
              transform: 'scale(1)',
            },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          height: 8,
          backgroundColor: 'rgba(242, 226, 208, 0.3)',
        },
        bar: {
          borderRadius: 10,
          background: 'linear-gradient(135deg, #9B4F2B 0%, #B67D62 100%)',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#9B4F2B',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#D98A63',
      light: '#E3A988',
      dark: '#B36B47',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2A2A2A',
      light: '#3D3D3D',
      dark: '#1C1C1C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#1C1C1C',
      paper: '#2A2A2A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
    },
  },
  components: {
    ...theme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(42, 42, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(217, 138, 99, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 40px rgba(217, 138, 99, 0.2)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(42, 42, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(217, 138, 99, 0.2)',
          boxShadow: '0 4px 20px rgba(217, 138, 99, 0.15)',
        },
      },
    },
  },
});

