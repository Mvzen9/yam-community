import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../store/AuthContext';
import AnimatedBox from '../components/animation/AnimatedBox';

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, verifyCode, loading: authLoading } = useAuth();
  
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [tempToken, setTempToken] = useState<string>('');
  const [userData, setUserData] = useState<any>(null);
  
  // Check if we have the required data in location state
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      
      if (location.state?.tempToken) {
        setTempToken(location.state.tempToken);
      }
      
      if (location.state?.userData) {
        setUserData(location.state.userData);
      }
    } else {
      // If we don't have the required data, redirect to register
      navigate('/register', { replace: true });
    }
  }, [location.state, navigate]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (!tempToken) {
      setError('Missing verification token. Please request a new code.');
      return;
    }

    setLoading(true);
    try {
      // Call the verify method from AuthContext with user data
      await verifyCode(verificationCode, tempToken, userData);
      
      // If verification is successful, redirect to home page
      navigate('/', { replace: true });
    } catch (err) {
      setError('An error occurred during verification. Please try again.');
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setLoading(true);
    
    try {
      // Use the sendVerificationCode function from AuthContext
      const { token, userId } = await sendVerificationCode(email);
      
      // Update the temporary token
      setTempToken(token);
      
      // Update the userId in userData if it exists
      if (userData) {
        setUserData({ ...userData, id: userId });
      }
      
      setError(null);
      // Show success message
      alert('Verification code has been resent to your email.');
    } catch (err) {
      setError('An error occurred while resending the code. Please try again.');
      console.error('Resend code error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
          }}
        >
          <AnimatedBox animation="fadeIn" delay={0.1}>
            <Typography
              variant="h4"
              component="h1"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 3,
              }}
            >
              Verify Your Email
            </Typography>
          </AnimatedBox>

          <AnimatedBox animation="fadeIn" delay={0.2}>
            <Typography variant="body1" align="center" sx={{ mb: 3 }}>
              We've sent a verification code to <strong>{email}</strong>. Please enter the code below to verify your account.
            </Typography>
          </AnimatedBox>

          {error && (
            <AnimatedBox animation="slideInLeft" delay={0.2}>
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: '1.2rem',
                  },
                }}
              >
                {error}
              </Alert>
            </AnimatedBox>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <AnimatedBox animation="slideInLeft" delay={0.3}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="verificationCode"
                label="Verification Code"
                name="verificationCode"
                autoComplete="one-time-code"
                value={verificationCode}
                onChange={handleChange}
                autoFocus
                sx={{
                  mt: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-2px)',
                    },
                  },
                }}
              />
            </AnimatedBox>

            <AnimatedBox animation="scaleIn" delay={0.4}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #9B4F2B 0%, #B67D62 100%)',
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
                    background: 'linear-gradient(135deg, #723A20 0%, #9B4F2B 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(155, 79, 43, 0.4)',
                    '&::before': {
                      left: '100%',
                    },
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  '&:disabled': {
                    background: 'rgba(155, 79, 43, 0.3)',
                    transform: 'none',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: 'white',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                ) : (
                  'Verify'
                )}
              </Button>
            </AnimatedBox>

            <AnimatedBox animation="fadeIn" delay={0.5}>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="text"
                  onClick={handleResendCode}
                  disabled={loading}
                  sx={{
                    color: 'primary.main',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(155, 79, 43, 0.08)',
                    },
                  }}
                >
                  Didn't receive a code? Resend
                </Button>
              </Box>
            </AnimatedBox>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Verify;