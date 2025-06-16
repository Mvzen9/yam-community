import { Container, Box, Typography } from '@mui/material';
import AuthForm from '../components/auth/AuthForm';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Join YAM Today
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Connect with communities and share your interests
        </Typography>
      </Box>
      
      <AuthForm mode="register" />
    </Container>
  );
};

export default Register;