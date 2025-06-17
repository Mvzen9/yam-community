import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Tabs, Tab, Container } from '@mui/material';
import { useAuth } from '../store/AuthContext';
import AnimatedBox from '../components/animation/AnimatedBox';


const Home = () => {
  const [loading, setLoading] = useState(false);
  const [feedType, setFeedType] = useState('for-you');
  const { user } = useAuth();
  const username = user?.username || 'Friend';

  const handleFeedChange = (_event: React.SyntheticEvent, newValue: string) => {
    setFeedType(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, #9B4F2B 0%, #B67D62 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
     
      <Box
        sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          top: '10%',
          left: '5%',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          bottom: '10%',
          right: '5%',
        }}
      />

      <Container maxWidth="lg" sx={{ textAlign: 'center', zIndex: 2 }}>
        <AnimatedBox animation="fadeIn" duration={1.2}>
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              fontWeight: 300,
              letterSpacing: 2,
              mb: 2,
            }}
          >
            WELCOME TO
          </Typography>
        </AnimatedBox>

        <AnimatedBox animation="scaleIn" duration={1.5} delay={0.3}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', sm: '4rem', md: '6rem' },
              fontWeight: 700,
              color: '#fff',
              textShadow: '0 4px 8px rgba(0,0,0,0.2)',
              mb: 2,
            }}
          >
            YAM!
          </Typography>
        </AnimatedBox>

        <AnimatedBox animation="slideInRight" duration={1} delay={0.6}>
          <Typography
            variant="h3"
            sx={{
              color: '#fff',
              fontWeight: 500,
              mb: 4,
            }}
          >
            Hello, {username}!
          </Typography>
        </AnimatedBox>

        <AnimatedBox animation="pulse" delay={1.2}>
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: '#fff',
                fontSize: '1.2rem',
                lineHeight: 1.6,
              }}
            >
              Connect with friends, share your moments, and discover communities that match your interests.
            </Typography>
          </Box>
        </AnimatedBox>
      </Container>
    </Box>
  );
};

export default Home;