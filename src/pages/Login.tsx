import { Box, Container, Typography } from '@mui/material';
import AuthForm from '../components/auth/AuthForm';
import AnimatedBox from '../components/animation/AnimatedBox';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #f2e2d0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <AnimatedBox animation="fadeIn" delay={0.1}>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #9B4F2B 0%, #B67D62 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 2,
              }}
            >
              Welcome Back to YAM
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{
                fontWeight: 400,
                opacity: 0.8,
                maxWidth: '400px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Your community awaits you
            </Typography>
          </Box>
        </AnimatedBox>
        
        <AnimatedBox animation="scaleIn" delay={0.3}>
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              padding: 4,
              boxShadow: '0 20px 40px rgba(155, 79, 43, 0.1)',
              border: '1px solid rgba(242, 226, 208, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 25px 50px rgba(155, 79, 43, 0.15)',
              },
            }}
          >
            <AuthForm mode="login" />
          </Box>
        </AnimatedBox>

        <AnimatedBox animation="fadeIn" delay={0.5}>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                opacity: 0.7,
                fontSize: '0.875rem',
              }}
            >
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </Box>
        </AnimatedBox>
      </Container>
    </Box>
  );
};

export default Login;

