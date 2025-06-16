import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import logoSrc from "../../assets/logo.svg"; // Adjust the path as necessary

const Logo = () => {
  return (
    <Box
      component={Link}
      to="/"
      className="yam-logo"
      sx={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        mr: 1,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: 2,
        padding: 1,
        '&:hover': {
          transform: 'scale(1.05) rotate(2deg)',
          backgroundColor: 'rgba(155, 79, 43, 0.05)',
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            background: 'linear-gradient(135deg, #9B4F2B, #B67D62, #F2E2D0)',
            borderRadius: '50%',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            zIndex: -1,
          },
          '&:hover::before': {
            opacity: 0.1,
          },
        }}
      >
        <img
          src={logoSrc}
          alt="YAM Logo"
          style={{ 
            width: "40px", 
            height: "40px", 
            marginRight: "8px",
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'drop-shadow(0 2px 4px rgba(155, 79, 43, 0.2))',
          }}
        />
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(135deg, #9B4F2B 0%, #B67D62 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '1.2rem',
          letterSpacing: '0.5px',
          transition: 'all 0.3s ease',
          '&:hover': {
            letterSpacing: '1px',
          },
        }}
      >
        YAM
      </Typography>
    </Box>
  );
};

export default Logo;

