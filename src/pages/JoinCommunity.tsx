import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useCommunity } from '../store/CommunityContext';

const JoinCommunity = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { joinCommunity, error: contextError } = useCommunity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      setError('Please enter an invite code');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      await joinCommunity(inviteCode.trim());
      setSuccess(true);
      // Reset form
      setInviteCode('');
      // Redirect to communities list after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(contextError || 'Failed to join community. Please check your invite code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Join a Community
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          Enter the invite code to join a private community
        </Typography>

        <Paper elevation={3} sx={{ p: 4 }}>
          {success ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Successfully joined the community! Redirecting...
            </Alert>
          ) : null}

          {error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : null}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Invite Code"
              variant="outlined"
              fullWidth
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              disabled={isSubmitting}
              sx={{ mb: 3 }}
              placeholder="Enter the 6-character invite code"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
              sx={{ py: 1.5 }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Join Community'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default JoinCommunity;